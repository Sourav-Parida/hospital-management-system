import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../api/appointmentApi";
import { fetchPatients } from "../api/patientApi";
import { fetchDoctors } from "../api/doctorApi";
import "./AppointmentsPage.css";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentDateTime: "",
    status: "Scheduled",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appData, patData, docData] = await Promise.all([
        fetchAppointments(),
        fetchPatients(),
        fetchDoctors(),
      ]);
      setAppointments(appData);
      setPatients(patData);
      setDoctors(docData);
    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !formData.appointmentDateTime) {
      toast.error("Please fill required fields.");
      return;
    }
    try {
      if (editingId) {
        await updateAppointment(editingId, formData);
        toast.success("Appointment updated!");
      } else {
        await createAppointment(formData);
        toast.success("Appointment created!");
      }
      setFormData({
        patientId: "",
        doctorId: "",
        appointmentDateTime: "",
        status: "Scheduled",
        notes: "",
      });
      setEditingId(null);
      loadData();
    } catch {
      toast.error("Error saving appointment.");
    }
  };

  const handleEdit = (appointment) => {
    setFormData({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      appointmentDateTime: appointment.appointmentDateTime.slice(0, 16), // for datetime-local input
      status: appointment.status,
      notes: appointment.notes || "",
    });
    setEditingId(appointment.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await deleteAppointment(id);
      toast.success("Appointment deleted!");
      loadData();
    } catch {
      toast.error("Failed to delete appointment.");
    }
  };

  return (
    <div className="page-container">
      <h2>Appointment Management</h2>
      <form className="appointment-form" onSubmit={handleSubmit}>
        <label>Patient</label>
        <select
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          required
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.fullName}
            </option>
          ))}
        </select>

        <label>Doctor</label>
        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.fullName} ({d.speciality})
            </option>
          ))}
        </select>

        <label>Appointment Date & Time</label>
        <input
          type="datetime-local"
          name="appointmentDateTime"
          value={formData.appointmentDateTime}
          onChange={handleChange}
          required
        />

        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Optional notes"
        />

        <button type="submit">{editingId ? "Update" : "Add"} Appointment</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({
                patientId: "",
                doctorId: "",
                appointmentDateTime: "",
                status: "Scheduled",
                notes: "",
              });
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="appointments-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No appointments found
              </td>
            </tr>
          ) : (
            appointments.map((app) => {
              const patient = patients.find((p) => p.id === app.patientId);
              const doctor = doctors.find((d) => d.id === app.doctorId);
              return (
                <tr key={app.id}>
                  <td>{patient ? patient.fullName : "Unknown"}</td>
                  <td>{doctor ? `${doctor.fullName} (${doctor.speciality})` : "Unknown"}</td>
                  <td>{new Date(app.appointmentDateTime).toLocaleString()}</td>
                  <td>{app.status}</td>
                  <td>{app.notes}</td>
                  <td className="action-buttons">
                    <button onClick={() => handleEdit(app)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(app.id)} className="delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
