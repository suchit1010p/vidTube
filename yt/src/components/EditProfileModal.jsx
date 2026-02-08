import React, { useState, useEffect } from "react";
import { useUpdateAccount } from "../features/auth/auth.hooks";
import ChangePasswordModal from "./ChangePasswordModal";

const EditProfileModal = ({ isOpen, onClose, user }) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    const updateAccountMutation = useUpdateAccount();

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || "");
            setEmail(user.email || "");
        }
    }, [user]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        updateAccountMutation.mutate(
            { fullName, email },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

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
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {updateAccountMutation.isError && (
                        <div className="error-message">
                            {updateAccountMutation.error?.response?.data?.message || "Failed to update profile"}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="change-password-btn" onClick={() => setIsChangePasswordOpen(true)}>
                            Change Password
                        </button>
                        <div className="right-actions">
                            <button type="button" className="cancel-btn" onClick={onClose} disabled={updateAccountMutation.isLoading}>
                                Cancel
                            </button>
                            <button type="submit" className="save-btn" disabled={updateAccountMutation.isLoading}>
                                {updateAccountMutation.isLoading ? "Saving..." : "Save Changes"}
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
