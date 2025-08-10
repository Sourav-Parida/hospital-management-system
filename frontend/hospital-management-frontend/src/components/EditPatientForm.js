import React, { useState } from "react";

function EditPatientForm({ patient, onSave, onCancel }) {
  // Defensive: If patient.dateOfBirth exists and has "T", split, else just use patient.dateOfBirth
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  };

  const [formData, setFormData] = useState({
    ...patient,
    dateOfBirth: formatDate(patient.dateOfBirth),
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      <h3>Edit Patient</h3>

      <label>Full Name</label>
      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        required
      />

      <label>Date of Birth</label>
      <input
        type="date"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        required
      />

      <label>Gender</label>
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        required
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <label>Contact Number</label>
      <input
        type="text"
        name="contactNumber"
        value={formData.contactNumber}
        onChange={handleChange}
        required
      />

      <label>Address</label>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
      />

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
        Cancel
      </button>
    </form>
  );
}

export default EditPatientForm;
