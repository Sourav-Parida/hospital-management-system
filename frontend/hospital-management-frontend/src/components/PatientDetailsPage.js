import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "./PatientDetailsPage.css";

export default function PatientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://localhost:5226/api/patients/${id}`);
      setPatient(res.data);
      setFormData(res.data); // initialize form with current data
    } catch (err) {
      toast.error("Failed to load patient details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://localhost:5226/api/patients/${id}`, formData);
      toast.success("Patient details updated");
      setIsEditing(false);
      fetchPatient();
    } catch (err) {
      toast.error("Failed to update patient");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await axios.delete(`https://localhost:5226/api/patients/${id}`);
      toast.success("Patient deleted");
      navigate("/patients");
    } catch (err) {
      toast.error("Failed to delete patient");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!patient) return <div>Patient not found.</div>;

  return (
    <div className="page-container">
      <h2>Patient Details: {patient.fullName}</h2>

      {isEditing ? (
        <form className="patient-edit-form" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <label>Full Name</label>
          <input name="fullName" value={formData.fullName || ""} onChange={handleChange} required />

          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth ? formData.dateOfBirth.split("T")[0] : ""}
            onChange={handleChange}
            required
          />

          <label>Gender</label>
          <select name="gender" value={formData.gender || ""} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Contact Number</label>
          <input name="contactNumber" value={formData.contactNumber || ""} onChange={handleChange} required />

          <label>Address</label>
          <textarea name="address" value={formData.address || ""} onChange={handleChange} />

          <label>Admission Date</label>
          <input
            type="date"
            name="admissionDate"
            value={formData.admissionDate ? formData.admissionDate.split("T")[0] : ""}
            onChange={handleChange}
          />

          <label>Diseases & Symptoms</label>
          <textarea name="diseasesSymptoms" value={formData.diseasesSymptoms || ""} onChange={handleChange} />

          <label>Procedures</label>
          <textarea name="procedures" value={formData.procedures || ""} onChange={handleChange} />

          <label>Medicines</label>
          <textarea name="medicines" value={formData.medicines || ""} onChange={handleChange} />

          <label>Bed Number</label>
          <input name="bedNumber" value={formData.bedNumber || ""} onChange={handleChange} />

          <label>Ward</label>
          <input name="ward" value={formData.ward || ""} onChange={handleChange} />

          <label>Other Notes</label>
          <textarea name="otherNotes" value={formData.otherNotes || ""} onChange={handleChange} />

          <button type="submit">Save</button>
          <button type="button" onClick={() => { setIsEditing(false); setFormData(patient); }} style={{marginLeft: "10px"}}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <table className="details-table">
            <tbody>
              <tr><th>ID</th><td>{patient.id}</td></tr>
              <tr><th>Full Name</th><td>{patient.fullName}</td></tr>
              <tr><th>Date of Birth</th><td>{patient.dateOfBirth?.split("T")[0]}</td></tr>
              <tr><th>Gender</th><td>{patient.gender}</td></tr>
              <tr><th>Contact Number</th><td>{patient.contactNumber}</td></tr>
              <tr><th>Address</th><td>{patient.address}</td></tr>
              <tr><th>Admission Date</th><td>{patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString() : "-"}</td></tr>
              <tr><th>Diseases & Symptoms</th><td>{patient.diseasesSymptoms || "-"}</td></tr>
              <tr><th>Procedures</th><td>{patient.procedures || "-"}</td></tr>
              <tr><th>Medicines</th><td>{patient.medicines || "-"}</td></tr>
              <tr><th>Bed Number</th><td>{patient.bedNumber || "-"}</td></tr>
              <tr><th>Ward</th><td>{patient.ward || "-"}</td></tr>
              <tr><th>Other Notes</th><td>{patient.otherNotes || "-"}</td></tr>
            </tbody>
          </table>

          <div style={{ marginTop: "20px" }}>
            <button onClick={() => setIsEditing(true)}>Edit Details</button>
            <button
              onClick={handleDelete}
              style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
            >
              Delete Patient
            </button>
          </div>
        </>
      )}

      <button onClick={() => navigate(-1)} style={{ marginTop: "20px" }}>
        Back to Patients List
      </button>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
