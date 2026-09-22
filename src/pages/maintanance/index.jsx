import axios from "axios";
import { pad } from "lodash";
import React from "react";

const Maintenance = () => {
    const [maintenanceMessage, setMaintenanceMessage] = React.useState("");
    React.useEffect(() => {
       axios.get(`${process.env.REACT_APP_SITE_URL}/maintenance.json?v=${Date.now()}`).then((res) => {
      setMaintenanceMessage(res.data.message);
    });
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <img
                    src="https://cdn-icons-png.flaticon.com/512/564/564619.png"
          alt="Maintenance"
          style={styles.image}
        />

        <h1 style={styles.title}>We'll Be Back Soon</h1>

        <p style={styles.subtitle}>
          Our website is currently under maintenance.
        </p>

        <div style={styles.messageBox}>
          <h3 style={styles.messageTitle}>📢 Admin Notice</h3>
          <p style={styles.messageText} >{maintenanceMessage}</p>
        </div>

        <div style={styles.footer}>
          <p>Need help?</p>
          <a href="mailto:support@example.com" style={styles.link}>
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1e293b, #0f172a)",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#111827",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
    maxWidth: "420px",
    width: "90%",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  image: {
    width: "100px",
    marginBottom: "20px",
    opacity: 0.9,
  },
  title: {
    fontSize: "28px",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#9ca3af",
    marginBottom: "20px",
  },
  messageBox: {
    background: "#1f2937",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    border: "1px solid #374151",
  },
  messageTitle: {
    marginBottom: "8px",
    color: "#facc15",
  },
  messageText: {
    fontSize: "16px",
    color: "#d1d5db",
    padding: "3px 0",
    lineHeight: "1.5",
  },
  footer: {
    fontSize: "14px",
    color: "#9ca3af",
  },
  link: {
    color: "#38bdf8",
    textDecoration: "none",
    marginLeft: "5px",
  },
};

export default Maintenance;