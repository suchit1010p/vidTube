import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../store/slices/authSlice";
import { FaTimes, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { loading, error } = useSelector((state) => state.auth);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMsg("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setLocalError("All fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setLocalError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError("New passwords do not match.");
      return;
    }

    const resultAction = await dispatch(
      changePassword({ oldPassword, newPassword })
    );

    if (changePassword.fulfilled.match(resultAction)) {
      setSuccessMsg("Password changed successfully!");
      setTimeout(() => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSuccessMsg("");
        onClose();
      }, 1500);
    }
  };

  const displayedError = localError || error;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2100 }}>
      <div className="modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Change Password</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* CURRENT PASSWORD */}
            <div className="form-input-group">
              <label className="form-label" htmlFor="oldPassword">
                Current Password
              </label>
              <div className="auth-input-wrapper">
                <FaLock className="auth-input-icon" />
                <input
                  id="oldPassword"
                  type={showPass ? "text" : "password"}
                  className="form-control auth-input-padding"
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    setLocalError("");
                  }}
                  required
                />
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="form-input-group">
              <label className="form-label" htmlFor="newPassword">
                New Password
              </label>
              <div className="auth-input-wrapper">
                <FaLock className="auth-input-icon" />
                <input
                  id="newPassword"
                  type={showPass ? "text" : "password"}
                  className="form-control auth-input-padding"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setLocalError("");
                  }}
                  required
                />
              </div>
            </div>

            {/* CONFIRM NEW PASSWORD */}
            <div className="form-input-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <div className="auth-input-wrapper">
                <FaLock className="auth-input-icon" />
                <input
                  id="confirmPassword"
                  type={showPass ? "text" : "password"}
                  className="form-control auth-input-padding"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setLocalError("");
                  }}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {displayedError && (
              <div className="auth-error-alert animate-fade-in">
                {displayedError}
              </div>
            )}

            {successMsg && (
              <div
                className="animate-fade-in"
                style={{
                  padding: "10px 14px",
                  backgroundColor: "var(--success-bg)",
                  color: "var(--success)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.88rem",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                {successMsg}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={loading || !oldPassword || !newPassword || !confirmPassword}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;