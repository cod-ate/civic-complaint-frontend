const API = `${import.meta.env.VITE_API_URL}/api`;


function adminHeaders() {
  const token = sessionStorage.getItem("adminToken");

  return token
    ? { "X-Admin-Token": token }
    : {};
}


async function readResponse(response) {

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Request failed"
    );
  }

  return data;
}


// =========================================================
// SEND OTP
// =========================================================

export async function sendOtp(email) {

  const formData = new FormData();

  formData.append("email", email);

  const response = await fetch(
    `${API}/complaints/send-otp`,
    {
      method: "POST",
      body: formData
    }
  );

  return readResponse(response);
}


// =========================================================
// VERIFY OTP
// =========================================================


export async function verifyOtp(formData) {

  const response = await fetch(
    `${API}/complaints/verify-otp`,
    {
      method: "POST",
      body: formData
    }
  );

  return readResponse(response);
}


// =========================================================
// ADMIN LOGIN
// =========================================================

export async function adminLogin(
  userId,
  password
) {

  const response = await fetch(
    `${API}/admin/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        userId,
        password
      })
    }
  );

  return readResponse(response);
}


// =========================================================
// ADMIN LOGOUT
// =========================================================

export async function adminLogout() {

  const response = await fetch(
    `${API}/admin/logout`,
    {
      method: "POST",

      headers: adminHeaders()
    }
  );

  return readResponse(response);
}


// =========================================================
// GET COMPLAINTS
// =========================================================

export async function getComplaints() {

  const response = await fetch(
    `${API}/complaints`,
    {
      headers: adminHeaders()
    }
  );

  return readResponse(response);
}


// =========================================================
// SOLVE COMPLAINT
// =========================================================

export async function solveComplaint(id) {

  const response = await fetch(
    `${API}/admin/complaints/${id}/solve`,
    {
      method: "POST",

      headers: adminHeaders()
    }
  );

  return readResponse(response);
}


// =========================================================
// DELETE COMPLAINT
// =========================================================

export async function deleteComplaint(id) {

  const response = await fetch(
    `${API}/complaints/${id}`,
    {
      method: "DELETE",

      headers: adminHeaders()
    }
  );

  return readResponse(response);
}


// =========================================================
// IMAGE URL
// =========================================================

export const imageUrl = (id) =>
  `${API}/complaints/${id}/image`;


// =========================================================
// IMAGE HEADERS
// =========================================================

export const imageHeaders = () =>
  adminHeaders();