import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  fetchDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../api/doctorApi";
import "./DoctorsPage.css";

const specialities = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "General",
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    speciality: "",
    contactNumber: "",
  });
  const [editingId, setEditingId] = useState(null);

  const loadDoctors = async () => {
    try {
      const data = await fetchDoctors();
      setDoctors(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoctor(editingId, formData);
        toast.success("Doctor updated!");
      } else {
        await createDoctor(formData);
        toast.success("Doctor added!");
      }
      setFormData({ fullName: "", speciality: "", contactNumber: "" });
      setEditingId(null);
      loadDoctors();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (doctor) => {
    setFormData({
      fullName: doctor.fullName,
      speciality: doctor.speciality,
      contactNumber: doctor.contactNumber,
    });
    setEditingId(doctor.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await deleteDoctor(id);
      toast.success("Doctor deleted!");
      loadDoctors();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="page-container">
      <h2>Doctor Management</h2>

      <form className="doctor-form" onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <label>Speciality</label>
        <select
          name="speciality"
          value={formData.speciality}
          onChange={handleChange}
          required
        >
          <option value="">Select Speciality</option>
          {specialities.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        <label>Contact Number</label>
        <input
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          required
        />

        <button type="submit">{editingId ? "Update" : "Add"} Doctor</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({ fullName: "", speciality: "", contactNumber: "" });
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="doctors-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Speciality</th>
            <th>Contact Number</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {doctors.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No doctors found
              </td>
            </tr>
          ) : (
            doctors.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.fullName}</td>
                <td>{doc.speciality}</td>
                <td>{doc.contactNumber}</td>
                <td className="action-buttons">
                  <button onClick={() => handleEdit(doc)} className="edit-btn">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
