import axios from "axios";

const apiBase = "https://localhost:5226/api/appointments";

export async function fetchAppointments() {
  const res = await axios.get(apiBase);
  return res.data;
}

export async function createAppointment(data) {
  const res = await axios.post(apiBase, data);
  return res.data;
}

export async function updateAppointment(id, data) {
  const res = await axios.put(`${apiBase}/${id}`, data);
  return res.data;
}

export async function deleteAppointment(id) {
  const res = await axios.delete(`${apiBase}/${id}`);
  return res.data;
}
