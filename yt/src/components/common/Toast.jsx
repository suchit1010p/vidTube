import React, { useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";
import "./toast.css";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <FaCheckCircle className="toast-icon success" />,
    error: <FaExclamationCircle className="toast-icon error" />,
    info: <FaInfoCircle className="toast-icon info" />,
  };

  return (
    <div className={`toast-card toast-${type} animate-fade-in`}>
      {icons[type] || icons.info}
      <span className="toast-text">{message}</span>
      <button className="toast-close-btn" onClick={onClose} aria-label="Close">
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast;
