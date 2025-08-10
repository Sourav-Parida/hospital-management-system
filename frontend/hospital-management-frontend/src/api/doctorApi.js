const API_BASE = "https://localhost:5226/api/doctors";

export async function fetchDoctors() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
}

export async function createDoctor(data) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create doctor");
  return res.json();
}

export async function updateDoctor(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update doctor");
}

export async function deleteDoctor(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete doctor");
}
