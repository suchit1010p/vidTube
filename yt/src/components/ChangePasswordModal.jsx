import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { changePassword } from "../store/slices/authSlice";

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters");
            return;
        }

        setIsSubmitting(true);
        const resultAction = await dispatch(
            changePassword({ oldPassword, newPassword })
        );
        setIsSubmitting(false);

        if (changePassword.fulfilled.match(resultAction)) {
            setSuccessMsg("Password changed successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                onClose();
                setSuccessMsg("");
            }, 1500);
        } else {
            setError(resultAction.payload || "Failed to change password");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Change Password</h3>
                    <button className="close-btn" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="oldPassword">Current Password</label>
                        <input
                            id="oldPassword"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => {
                                setOldPassword(e.target.value);
                                setError("");
                            }}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setError("");
                            }}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setError("");
                            }}
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-message" style={{ color: "#e74c3c", margin: "8px 0" }}>
                            {error}
                        </div>
                    )}
                    {successMsg && (
                        <div
                            className="success-message"
                            style={{ color: "#2ecc71", fontSize: "0.9rem", marginTop: "0.5rem" }}
                        >
                            {successMsg}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="save-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Changing..." : "Change Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;