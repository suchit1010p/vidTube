import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAccount } from "../store/slices/authSlice";
import ChangePasswordModal from "./ChangePasswordModal";
import { FaTimes, FaUser, FaEnvelope, FaKey } from "react-icons/fa";

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [localError, setLocalError] = useState("");

  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setLocalError("");
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!fullName.trim() || !email.trim()) {
      setLocalError("Name and email are required.");
      return;
    }

    const resultAction = await dispatch(
      updateAccount({ fullName: fullName.trim(), email: email.trim() })
    );

    if (updateAccount.fulfilled.match(resultAction)) {
      onClose();
    }
  };

  const displayedError = localError || error;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Profile</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-input-group">
              <label className="form-label" htmlFor="editFullName">
                Full Name
              </label>
              <div className="auth-input-wrapper">
                <FaUser className="auth-input-icon" />
                <input
                  id="editFullName"
                  type="text"
                  className="form-control auth-input-padding"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setLocalError("");
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-input-group">
              <label className="form-label" htmlFor="editEmail">
                Email Address
              </label>
              <div className="auth-input-wrapper">
                <FaEnvelope className="auth-input-icon" />
                <input
                  id="editEmail"
                  type="email"
                  className="form-control auth-input-padding"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLocalError("");
                  }}
                  required
                />
              </div>
            </div>

            {displayedError && (
              <div className="auth-error-alert animate-fade-in">
                {displayedError}
              </div>
            )}

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ width: "100%", marginTop: "4px" }}
              onClick={() => setIsChangePasswordOpen(true)}
            >
              <FaKey size={12} />
              <span>Change Password</span>
            </button>
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
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* CHANGE PASSWORD MODAL */}
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      </div>
    </div>
  );
};

export default EditProfileModal;
