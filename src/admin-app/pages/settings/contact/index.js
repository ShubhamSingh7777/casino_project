import React, { useEffect, useState } from "react";
import axios from "axios";
import authService from "../../../../services/auth.service";

const ContactEditor = () => {
  const [whatsapp, setWhatsapp] = useState("");
  const [telegram, setTelegram] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingWhatsapp, setSavingWhatsapp] = useState(false);
  const [savingTelegram, setSavingTelegram] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Axios base instance (optional but recommended)
  const api = axios.create({
    baseURL: "/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 🔹 Fetch existing data
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await authService.getContact()
        console.log(response.data)
        setWhatsapp(response.data.data.whatsapp || "");
        setTelegram(response.data.data.telegram || "");
      } catch (err) {
        setError("Failed to load contact details.");
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  // 🔹 Update WhatsApp
  const updateWhatsapp = async (e) => {
    e.preventDefault();
    setSavingWhatsapp(true);

    try {
     await authService.updateContact(whatsapp,'whatsapp')
      // await api.post("/contact-update", { whatsapp,type:'whatsapp' });
      alert("WhatsApp updated successfully!");
    } catch (err) {
      alert("Failed to update WhatsApp.");
    } finally {
      setSavingWhatsapp(false);
    }
  };

  // 🔹 Update Telegram
  const updateTelegram = async (e) => {
    e.preventDefault();
    setSavingTelegram(true);

    try {
       await authService.updateContact(telegram,'telegram')
      // await api.post("/contact-update", { telegram,type:'telegram' });
      alert("Telegram updated successfully!");
    } catch (err) {
      alert("Failed to update Telegram.");
    } finally {
      setSavingTelegram(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading contact details...</div>;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Contact Information</h2>

        {error && <p style={styles.error}>{error}</p>}

        {/* WhatsApp Form */}
        <form onSubmit={updateWhatsapp} style={styles.form}>
          <label style={styles.label}>WhatsApp Number</label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={savingWhatsapp}>
            {savingWhatsapp ? "Saving..." : "Update WhatsApp"}
          </button>
        </form>

        {/* Telegram Form */}
        <form onSubmit={updateTelegram} style={styles.form}>
          <label style={styles.label}>Telegram Username</label>
          <input
            type="text"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={savingTelegram}>
            {savingTelegram ? "Saving..." : "Update Telegram"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #87CEEB, #4DA6FF)",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "450px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#1e3a8a",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },
  label: {
    marginBottom: "6px",
    fontWeight: "600",
    color: "#1e3a8a",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "12px",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4DA6FF",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s",
  },
  loading: {
    textAlign: "center",
    marginTop: "100px",
    fontSize: "18px",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default ContactEditor;