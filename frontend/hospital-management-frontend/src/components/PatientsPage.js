import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { fetchPatients } from "../api/patientApi";
import { useNavigate } from "react-router-dom";
import "./PatientsPage.css";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  const loadPatients = async () => {
    try {
      const data = await fetchPatients();
      setPatients(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <div className="page-container">
      <h2>Patients</h2>
      <table className="patients-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Bed Number</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No patients found
              </td>
            </tr>
          ) : (
            patients.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.fullName}</td>
                <td>{p.bedNumber || "-"}</td>
                <td>
                  <button onClick={() => navigate(`/patients/${p.id}`)}>
                    View Details
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
