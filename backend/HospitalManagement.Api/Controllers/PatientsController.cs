using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;
using HospitalManagement.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace HospitalManagement.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly string _connectionString;

        public PatientsController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // GET: api/patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
        {
            var patients = new List<Patient>();

            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("SELECT Id, FullName, DateOfBirth, Gender, ContactNumber, Address FROM Patients", conn);
                await conn.OpenAsync();

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        patients.Add(new Patient
                        {
                            Id = reader.GetInt32(0),
                            FullName = reader.GetString(1),
                            DateOfBirth = reader.GetDateTime(2),
                            Gender = reader.GetString(3),
                            ContactNumber = reader.GetString(4),
                            Address = reader.GetString(5)
                        });
                    }
                }
            }

            return Ok(patients);
        }

        // GET: api/patients/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            Patient patient = null;

            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("SELECT Id, FullName, DateOfBirth, Gender, ContactNumber, Address FROM Patients WHERE Id = @Id", conn);
                cmd.Parameters.AddWithValue("@Id", id);
                await conn.OpenAsync();

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        patient = new Patient
                        {
                            Id = reader.GetInt32(0),
                            FullName = reader.GetString(1),
                            DateOfBirth = reader.GetDateTime(2),
                            Gender = reader.GetString(3),
                            ContactNumber = reader.GetString(4),
                            Address = reader.GetString(5)
                        };
                    }
                }
            }

            if (patient == null)
                return NotFound();

            return Ok(patient);
        }

        // POST: api/patients
        [HttpPost]
        public async Task<ActionResult<Patient>> CreatePatient(Patient patient)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand(@"
                    INSERT INTO Patients (FullName, DateOfBirth, Gender, ContactNumber, Address)
                    VALUES (@FullName, @DateOfBirth, @Gender, @ContactNumber, @Address);
                    SELECT CAST(scope_identity() AS int);", conn);

                cmd.Parameters.AddWithValue("@FullName", patient.FullName);
                cmd.Parameters.AddWithValue("@DateOfBirth", patient.DateOfBirth);
                cmd.Parameters.AddWithValue("@Gender", patient.Gender);
                cmd.Parameters.AddWithValue("@ContactNumber", patient.ContactNumber);
                cmd.Parameters.AddWithValue("@Address", patient.Address);

                await conn.OpenAsync();
                var newId = (int)await cmd.ExecuteScalarAsync();
                patient.Id = newId;
            }

            return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patient);
        }

        // PUT: api/patients/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, Patient patient)
        {
            if (id != patient.Id)
                return BadRequest("Patient ID mismatch");

            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand(@"
                    UPDATE Patients
                    SET FullName = @FullName,
                        DateOfBirth = @DateOfBirth,
                        Gender = @Gender,
                        ContactNumber = @ContactNumber,
                        Address = @Address
                    WHERE Id = @Id", conn);

                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@FullName", patient.FullName);
                cmd.Parameters.AddWithValue("@DateOfBirth", patient.DateOfBirth);
                cmd.Parameters.AddWithValue("@Gender", patient.Gender);
                cmd.Parameters.AddWithValue("@ContactNumber", patient.ContactNumber);
                cmd.Parameters.AddWithValue("@Address", patient.Address);

                await conn.OpenAsync();
                var affectedRows = await cmd.ExecuteNonQueryAsync();

                if (affectedRows == 0)
                    return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/patients/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("DELETE FROM Patients WHERE Id = @Id", conn);
                cmd.Parameters.AddWithValue("@Id", id);

                await conn.OpenAsync();
                var affectedRows = await cmd.ExecuteNonQueryAsync();

                if (affectedRows == 0)
                    return NotFound();
            }

            return NoContent();
        }
    }
}
