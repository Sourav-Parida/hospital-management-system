namespace HospitalManagement.Api.Models
{
    public class Doctor
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;
    }
}
