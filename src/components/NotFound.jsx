import { motion } from "framer-motion"
import React from 'react'
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5, ease: "easeIn" } }
  };

  const buttonVariants = {
    hover: { scale: 1.1, backgroundColor: "#f87171", color: "#fff", transition: { duration: 0.3 } },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      className="notfound-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        textAlign: "center",
        padding: "0 20px",
        color: "#333",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <motion.h1
        style={{ fontSize: "6rem", marginBottom: "1rem", color: "#ef4444" }}
        aria-label="404"
        role="heading"
      >
        404
      </motion.h1>
      <motion.p
        style={{ fontSize: "1.5rem", marginBottom: "2rem" }}
      >
        Oops! The page you are looking for does not exist.
      </motion.p>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => navigate("/")}
        style={{
          padding: "12px 30px",
          fontSize: "1rem",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#ef4444",
          color: "#fff",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}
        aria-label="Go back to home page"
      >
        Go Home
      </motion.button>
    </motion.div>
  )
}

export default NotFound
