// src/components/AddPatient.js
import React, { useState } from "react";
import axios from "axios";

function AddPatient({ onPatientAdded }) {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    address: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:5226/api/patients", formData);
      alert("Patient added successfully!");
      setFormData({
        fullName: "",
        dateOfBirth: "",
        gender: "",
        contactNumber: "",
        address: ""
      });
      if (onPatientAdded) onPatientAdded(); // refresh list
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Patient</h3>
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        required
      />
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
      <input
        type="text"
        name="contactNumber"
        placeholder="Contact Number"
        value={formData.contactNumber}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Patient</button>
    </form>
  );
}

export default AddPatient;
