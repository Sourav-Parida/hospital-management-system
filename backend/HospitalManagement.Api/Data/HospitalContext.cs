using Microsoft.EntityFrameworkCore;
using HospitalManagement.Api.Models; // Make sure this matches your models' namespace

namespace HospitalManagement.Api.Data
{
    public class HospitalContext : DbContext
    {
        public HospitalContext(DbContextOptions<HospitalContext> options) : base(options)
        {
        }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        // Add more DbSets as needed
    }
}
