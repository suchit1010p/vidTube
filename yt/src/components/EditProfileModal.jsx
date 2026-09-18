import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAccount } from "../store/slices/authSlice";
import ChangePasswordModal from "./ChangePasswordModal";

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
      setLocalError("Name and email are required");
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Profile</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="editFullName">Full Name</label>
            <input
              id="editFullName"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setLocalError("");
              }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="editEmail">Email</label>
            <input
              id="editEmail"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLocalError("");
              }}
              required
            />
          </div>

          {displayedError && (
            <div className="error-message" style={{ color: "#e74c3c", margin: "8px 0" }}>
              {displayedError}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="change-password-btn"
              onClick={() => setIsChangePasswordOpen(true)}
            >
              Change Password
            </button>
            <div className="right-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      </div>
    </div>
  );
};

export default EditProfileModal;
