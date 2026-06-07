import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { teamData } from "../data/teamData";

export default function TeamMember() {
  const { id } = useParams();
  const navigate = useNavigate();

  const member = teamData.find(m => m.id === id);
  if (!member) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        minHeight: "100vh",
        padding: "120px 20px",
        background: "radial-gradient(circle at top, #161616, #0b0b0b)",
        color: "#fff",
        textAlign: "center"
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          background: "none",
          border: "1px solid #555",
          color: "#fff",
          padding: "8px 18px",
          borderRadius: "20px",
          cursor: "pointer"
        }}
      >
        ← Back
      </button>

      <motion.img
        src={`/images/${member.img}`}
        alt={member.name}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          marginBottom: "25px"
        }}
      />

      <h1>{member.name}</h1>
      <p style={{ color: "#ff2c2c" }}>
        {member.level} — {member.role}
      </p>

      <p style={{
        maxWidth: "700px",
        margin: "30px auto",
        color: "#bbb",
        lineHeight: "1.8"
      }}>
        {member.fullBio}
      </p>
    </motion.div>
  );
}
