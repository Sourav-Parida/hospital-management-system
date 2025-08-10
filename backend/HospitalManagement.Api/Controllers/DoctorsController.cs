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
    public class DoctorsController : ControllerBase
    {
        private readonly string _connectionString;

        public DoctorsController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctors()
        {
            var doctors = new List<Doctor>();

            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("SELECT Id, FullName, Specialty, ContactNumber FROM Doctors", conn);
                await conn.OpenAsync();

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        doctors.Add(new Doctor
                        {
                            Id = reader.GetInt32(0),
                            FullName = reader.GetString(1),
                            Specialty = reader.GetString(2),
                            ContactNumber = reader.GetString(3)
                        });
                    }
                }
            }

            return Ok(doctors);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctor(int id)
        {
            Doctor doctor = null;

            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("SELECT Id, FullName, Specialty, ContactNumber FROM Doctors WHERE Id = @Id", conn);
                cmd.Parameters.AddWithValue("@Id", id);
                await conn.OpenAsync();

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        doctor = new Doctor
                        {
                            Id = reader.GetInt32(0),
                            FullName = reader.GetString(1),
                            Specialty = reader.GetString(2),
                            ContactNumber = reader.GetString(3)
                        };
                    }
                }
            }

            if (doctor == null)
                return NotFound();

            return Ok(doctor);
        }

        [HttpPost]
        public async Task<ActionResult<Doctor>> CreateDoctor(Doctor doctor)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand(@"
                    INSERT INTO Doctors (FullName, Specialty, ContactNumber)
                    VALUES (@FullName, @Specialty, @ContactNumber);
                    SELECT CAST(scope_identity() AS int);", conn);

                cmd.Parameters.AddWithValue("@FullName", doctor.FullName);
                cmd.Parameters.AddWithValue("@Specialty", doctor.Specialty);
                cmd.Parameters.AddWithValue("@ContactNumber", doctor.ContactNumber);

                await conn.OpenAsync();
                var newId = (int)await cmd.ExecuteScalarAsync();
                doctor.Id = newId;
            }

            return CreatedAtAction(nameof(GetDoctor), new { id = doctor.Id }, doctor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, Doctor doctor)
        {
            if (id != doctor.Id)
                return BadRequest("Doctor ID mismatch");

            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand(@"
                    UPDATE Doctors
                    SET FullName = @FullName,
                        Specialty = @Specialty,
                        ContactNumber = @ContactNumber
                    WHERE Id = @Id", conn);

                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@FullName", doctor.FullName);
                cmd.Parameters.AddWithValue("@Specialty", doctor.Specialty);
                cmd.Parameters.AddWithValue("@ContactNumber", doctor.ContactNumber);

                await conn.OpenAsync();
                var affectedRows = await cmd.ExecuteNonQueryAsync();

                if (affectedRows == 0)
                    return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                var cmd = new SqlCommand("DELETE FROM Doctors WHERE Id = @Id", conn);
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
