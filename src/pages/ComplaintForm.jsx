import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  sendOtp,
  verifyOtp
} from "../api";

export default function ComplaintForm() {

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  // =========================================================
  // FORM DATA
  // =========================================================

  const [form, setForm] = useState({
    name: "",
    email: "",
    complaint: "",
    location: ""
  });

  // =========================================================
  // IMAGE
  // =========================================================

  const [image, setImage] = useState(null);

  // =========================================================
  // LOCATION
  // =========================================================

  const [locationStatus, setLocationStatus] =
    useState("Fetching location...");

  // =========================================================
  // OTP
  // =========================================================

  const [token, setToken] = useState("");

  const [otp, setOtp] = useState("");

  const [otpMode, setOtpMode] =
    useState(false);

  const [secondsLeft, setSecondsLeft] =
    useState(0);

  // =========================================================
  // UI
  // =========================================================

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // =========================================================
  // FETCH LOCATION
  // =========================================================

  useEffect(() => {

    if (!navigator.geolocation) {

      setLocationStatus(
        "Geolocation is not supported by this browser."
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const {
          latitude,
          longitude
        } = position.coords;

        const mapsLink =
          `https://www.google.com/maps?q=${latitude},${longitude}`;

        setForm((old) => ({
          ...old,
          location: mapsLink
        }));

        setLocationStatus(
          `Location detected: ` +
          `${latitude.toFixed(6)}, ` +
          `${longitude.toFixed(6)}`
        );
      },

      () => {

        setLocationStatus(
          "Could not fetch location. " +
          "Please allow location permission and refresh."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

  }, []);

  // =========================================================
  // OTP COUNTDOWN
  // =========================================================

  useEffect(() => {

    if (
      !otpMode ||
      secondsLeft <= 0
    ) {
      return;
    }

    const timer = setInterval(() => {

      setSecondsLeft(
        (s) => s - 1
      );

    }, 1000);

    return () => clearInterval(timer);

  }, [otpMode, secondsLeft]);

  // =========================================================
  // UPDATE FORM FIELD
  // =========================================================

  function updateField(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  // =========================================================
  // SEND OTP
  // =========================================================

  async function handleSendOtp(e) {

    e.preventDefault();

    setError("");
    setMessage("");

    // -----------------------------------------
    // Validate location
    // -----------------------------------------

    if (!form.location) {

      setError(
        "Location is required. " +
        "Please allow browser location access."
      );

      return;
    }

    // -----------------------------------------
    // Validate required fields
    // -----------------------------------------

    if (!form.name.trim()) {

      setError("Name is required.");

      return;
    }

    if (!form.email.trim()) {

      setError("Email is required.");

      return;
    }

    if (!form.complaint.trim()) {

      setError("Complaint is required.");

      return;
    }

    // -----------------------------------------
    // Validate image
    // -----------------------------------------

    if (!image) {

      setError(
        "Scene image is required. Please upload an image of the civic issue."
      );

      return;
    }

    try {

      setLoading(true);

      const result =
        await sendOtp(form.email);


      setToken(
        result.data.token
      );

      setOtpMode(true);


      setSecondsLeft(120);

      setMessage(
        "OTP sent to your email. " +
        "Enter it within 2 minutes."
      );

    } catch (err) {

      setError(
        err.message
      );

    } finally {

      setLoading(false);
    }
  }

  // =========================================================
  // VERIFY OTP
  // =========================================================

  async function handleVerify(e) {

    e.preventDefault();

    setError("");
    setMessage("");

    // -----------------------------------------
    // Check timer
    // -----------------------------------------

    if (secondsLeft <= 0) {

      setError(
        "OTP has expired. " +
        "Please request a new OTP."
      );

      return;
    }

    try {

      setLoading(true);

      // ---------------------------------------
      // Create FormData
      // ---------------------------------------

      const data = new FormData();

      // ---------------------------------------
      // OTP information
      // ---------------------------------------

      data.append(
        "token",
        token
      );

      data.append(
        "otp",
        otp
      );

      // ---------------------------------------
      // Complaint information
      // ---------------------------------------

      data.append(
        "name",
        form.name
      );

      data.append(
        "email",
        form.email
      );

      data.append(
        "complaint",
        form.complaint
      );

      data.append(
        "location",
        form.location
      );

      // ---------------------------------------
      // Image
      // ---------------------------------------

      if (image) {

        data.append(
          "image",
          image
        );
      }

      // ---------------------------------------
      // Send to backend
      // ---------------------------------------

      const result =
        await verifyOtp(data);

      // ---------------------------------------
      // Success
      // ---------------------------------------

      setMessage(
        result.message
      );

      setOtpMode(false);

      // ---------------------------------------
      // Clear form
      // ---------------------------------------

      setForm({
        name: "",
        email: "",
        complaint: "",
        location: ""
      });

      setImage(null);

      setOtp("");

      setToken("");

      setSecondsLeft(0);

      // Clear file input
      if (fileInputRef.current) {

        fileInputRef.current.value = "";
      }

    } catch (err) {

      setError(
        err.message
      );

    } finally {

      setLoading(false);
    }
  }

  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="complaint-page">

      <div className="form-card card complaint-card">

        {/* =================================================
            HOME BUTTON
        ================================================= */}

        <button
          className="back-link"
          onClick={() => navigate("/")}
        >
          ← Home
        </button>

        <div className="form-heading">
          <span className="form-icon">+</span>

          <div>
            <p className="eyebrow">
              COMMUNITY REPORTING
            </p>

            <h1>
              Raise a Complaint
            </h1>
          </div>
        </div>

        <p className="muted lead-copy">
          Report potholes, overflowing bins, fallen trees and
          other civic problems. Your report helps bring attention
          to issues that affect everyday community life.
        </p>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (

          <div className="success">
            {message}
          </div>

        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (

          <div className="error">
            {error}
          </div>

        )}

        {/* =================================================
            COMPLAINT FORM
        ================================================= */}

        {!otpMode ? (

          <form onSubmit={handleSendOtp}>

            {/* =============================================
                NAME
            ============================================= */}

            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              name="name"
              value={form.name}
              onChange={updateField}
              required
              placeholder="Enter your name"
            />

            {/* =============================================
                EMAIL
            ============================================= */}

            <label htmlFor="email">
              Email address
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={updateField}
              required
              placeholder="Enter your email"
            />

            {/* =============================================
                COMPLAINT
            ============================================= */}

            <label htmlFor="complaint">
              What needs attention?
            </label>

            <textarea
              id="complaint"
              name="complaint"
              value={form.complaint}
              onChange={updateField}
              required
              rows="5"
              placeholder="Describe the problem..."
            />

            {/* =============================================
                LOCATION
            ============================================= */}

            <label htmlFor="location">
              Detected location
            </label>

            <input
              id="location"
              value={form.location}
              readOnly
              placeholder="Fetching location..."
            />

            <small className="location-status">
              {locationStatus}
            </small>

            {/* =============================================
                IMAGE - REQUIRED
            ============================================= */}

            <label htmlFor="scene-image">
              Scene image
              <span className="required">
                Required
              </span>
            </label>

            <input
              id="scene-image"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              required
              onChange={(e) =>
                setImage(
                  e.target.files[0] || null
                )
              }
            />

            {image && (

              <p className="muted">
                Selected: {image.name}
              </p>

            )}

            {/* =============================================
                SEND OTP BUTTON
            ============================================= */}

            <button
              className="btn btn-primary btn-full"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Sending OTP..."
                : "Submit & Send OTP"
              }
            </button>

          </form>

        ) : (

          /* =================================================
             OTP FORM
          ================================================= */

          <form onSubmit={handleVerify}>

            <label>
              Enter OTP
            </label>

            <input
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              inputMode="numeric"
              maxLength="6"
              required
              placeholder="6-digit OTP"
            />

            {/* =============================================
                TIMER
            ============================================= */}

            <div className="timer otp-timer">

              OTP expires in{" "}

              <strong>

                {Math.floor(
                  secondsLeft / 60
                )}

                :

                {String(
                  secondsLeft % 60
                ).padStart(2, "0")}

              </strong>

            </div>

            {/* =============================================
                VERIFY BUTTON
            ============================================= */}

            <button
              className="btn btn-primary btn-full"
              type="submit"
              disabled={
                loading ||
                secondsLeft <= 0
              }
            >
              {loading
                ? "Verifying..."
                : "Verify OTP & Raise Complaint"
              }
            </button>

            {/* =============================================
                EXPIRED OTP
            ============================================= */}

            {secondsLeft <= 0 && (

              <button
                type="button"
                className="btn btn-outline btn-full"
                onClick={() => {

                  setOtpMode(false);

                  setOtp("");

                  setToken("");

                  setMessage(
                    "Please submit the form again " +
                    "to receive a new OTP."
                  );

                }}
              >
                Request New OTP
              </button>

            )}

          </form>

        )}

      </div>

    </div>
  );
}