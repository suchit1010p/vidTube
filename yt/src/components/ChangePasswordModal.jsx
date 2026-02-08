import React, { useState } from "react";
import { useChangePassword } from "../features/auth/auth.hooks";

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const changePasswordMutation = useChangePassword();

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }



        changePasswordMutation.mutate(
            { oldPassword, newPassword },
            {
                onSuccess: () => {
                    setSuccessMsg("Password changed successfully!");
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setTimeout(() => {
                        onClose();
                        setSuccessMsg("");
                    }, 1500);
                },
                onError: (err) => {
                    // The error message from backend usually comes in err.response.data.message
                    // or err.message
                    setError(err?.response?.data?.message || "Failed to change password");
                }
            }
        );
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
                        <label>Current Password</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {successMsg && <div className="success-message" style={{ color: 'green', fontSize: '0.9rem', marginTop: '0.5rem' }}>{successMsg}</div>}

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose} disabled={changePasswordMutation.isLoading}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn" disabled={changePasswordMutation.isLoading}>
                            {changePasswordMutation.isLoading ? "Changing..." : "Change Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
