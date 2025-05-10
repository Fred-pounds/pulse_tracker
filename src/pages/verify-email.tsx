import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient"; // Adjust the import path for your supabase client

const VerifyEmail: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const resendVerificationEmail = async () => {
    setLoading(true);
    setError(null);
  
    const { data: { user }, error: userError } = await supabase.auth.getUser();
  
    if (userError || !user) {
      setError("No user found. Please try signing up again.");
      setLoading(false);
      return;
    }
  
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
      });
  
      if (resendError) {
        setError("Failed to resend email. Please try again later.");
      } else {
        alert("Verification email sent! Please check your inbox.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Verify Your Email</h2>
        <p style={styles.message}>
          We’ve sent a verification link to your email address. Please check
          your inbox (and spam folder) to complete your registration.
        </p>

        <button
          style={styles.button}
          onClick={resendVerificationEmail}
          disabled={loading}
        >
          {loading ? "Resending..." : "Resend Verification Email"}
        </button>

        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.redirect}>
          Already verified?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f6f9", // light grey background
  },
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    fontSize: "1.5rem",
    color: "#1a73e8", // blue text
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "1.5rem",
  },
  button: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#1a73e8", // blue button
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  error: {
    color: "red",
    fontSize: "0.875rem",
    marginTop: "1rem",
  },
  redirect: {
    marginTop: "1.5rem",
    fontSize: "0.875rem",
  },
  link: {
    color: "#1a73e8", // blue link
    cursor: "pointer",
  },
};

export default VerifyEmail;
