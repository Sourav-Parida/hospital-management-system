const API_BASE = "https://localhost:5226/api/patients";

export async function fetchPatients() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
}

export async function createPatient(data) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create patient");
  return res.json();
}

export async function updatePatient(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update patient");
  return res.json(); // you can return the updated object or response if needed
}

export async function deletePatient(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete patient");
  return true; // or return something to confirm success
}
