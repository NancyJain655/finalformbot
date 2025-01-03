import React from 'react';
import styles from '../../assets/ShareModal.module.css'; // Create this CSS file for styling.

function ShareModal({ onClose }) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <button className={styles.closeButton} onClick={onClose}>✕</button>
                </div>
                <div className={styles.modalBody}>
                    <h4>Invite by Email</h4>
                    
                    <select value="edit" className={styles.permissionDropdown}>
                            <option value="edit">Edit</option>
                            <option value="view">View</option>
                        </select>
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            placeholder="Enter email id"
                            className={styles.inputField}
                        />
                        
                    </div>
                    <button className={styles.sendInviteButton}>Send Invite</button>

                    <h4>Invite by Link</h4>
                    <div className={styles.linkSection}>
                       { /*<input
                            type="text"
                            value="https://example.com/share-link"
                            readOnly
                            className={styles.linkInput}
                        />*/}
                        <button
                            className={styles.copyLinkButton}
                            onClick={() => navigator.clipboard.writeText("https://example.com/share-link")}
                        >
                            Copy Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShareModal;