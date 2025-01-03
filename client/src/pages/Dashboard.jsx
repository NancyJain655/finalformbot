
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { userDashboardApi } from "../apis/User";
import { createFolderApi, fetchAllFolderApi, deleteFolderApi } from "../apis/Folder";
import { fetchAllFormApi, deleteFormApi } from "../apis/Form";

import FolderButton from '../components/dashboard/FolderButton';
import FormCard from '../components/dashboard/FormCard';
import CreateFolderModal from '../components/dashboard/CreateFolderModal';
import DeleteModal from '../components/dashboard/DeleteModal';
import ShareModal from '../components/dashboard/ShareModal';

import styles from '../assets/Dashboard.module.css';

function Dashboard() {
    const token = useAuth();
    const navigate = useNavigate();

    const [userData, setUserData] = useState([]);
    const [allFolder, setAllFolder] = useState([]);
    const [folderId, setFolderId] = useState(null);
    const [folderName, setFolderName] = useState(null);
    const [folderNameError, setFolderNameError] = useState(null);
    const [allForm, setAllForm] = useState([]);
    const [formId, setFormId] = useState(null);
    const [entityType, setEntityType] = useState(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);


    // Load the theme from local storage if it exists
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkTheme(savedTheme === 'dark');
        }
    }, []);

    // Save the theme to local storage whenever it changes
    const handleThemeChange = () => {
        const newTheme = !isDarkTheme ? 'dark' : 'light';
        setIsDarkTheme(!isDarkTheme);
        localStorage.setItem('theme', newTheme);  // Store theme in local storage
    };

    const openCreateModal = () => {
        setFolderName(''); setFolderNameError('');
        setCreateModalOpen(true); setDeleteModalOpen(false);
    };

    const openDeleteModal = (id, type = "folder") => {
        setEntityType(type); setFormId(null); setFolderId(null);
        if (type === "form") setFormId(id); else setFolderId(id);
        setDeleteModalOpen(true); setCreateModalOpen(false);
    };

    const userDashboard = async () => {
        const data = await userDashboardApi(token);
        if (data) { setUserData(data); fetchAllFolder(); fetchAllForm(); }
    };

    const createFolder = async () => {
        setFolderNameError('');
        if (folderName.trim().length === 0) { setFolderNameError('Enter folder name'); return; }

        const data = await createFolderApi(folderName, token);
        if (data) { setCreateModalOpen(false); fetchAllFolder(); }
    };

    const fetchAllFolder = async () => {
        const data = await fetchAllFolderApi(token);
        if (data) setAllFolder(data);
    };

    const deleteFolder = async () => {
        const data = await deleteFolderApi(folderId, token);
        if (data) { setDeleteModalOpen(false); fetchAllFolder(); };
    };

    const fetchAllForm = async () => {
        const data = await fetchAllFormApi(token);
        if (data) setAllForm(data);
    };

    const deleteForm = async () => {
        const data = await deleteFormApi(formId, token);
        if (data) { setDeleteModalOpen(false); fetchAllForm(); };
    };
    const handleSharePopupOpen = () => setIsSharePopupVisible(true);
    const handleSharePopupClose = () => setIsSharePopupVisible(!isSharePopupVisible);

    useEffect(() => {
        if (token) { userDashboard(); }
    }, [token]);

    return (
        <main className={isDarkTheme ? styles.dashboardDark : styles.dashboard}>
            <div className={styles.navbar}>
                <div className={styles.navbarLeft}>
                    <div className={`${styles.dropdown} ${isDropdownOpen ? styles.show : ''}`}>
                        <button className={styles.dropdownBtn} onClick={() => setDropdownOpen(!isDropdownOpen)}>
                            <span>{userData.username ? `${userData.username}'s workspace` : "workspace"}</span>
                            <img className={styles.arrowDown} src="/icons/arrow-angle-down.png" alt="arrow-down icon" />
                        </button>
                        <div className={styles.dropdownContent}>
                            <Link to="/settings">Settings</Link>
                            <Link to="/login" onClick={() => localStorage.removeItem('authToken')} className={styles.logout}>Logout</Link>
                        </div>
                    </div>
                </div>

                {/* Right side elements (Theme toggle and Share button) */}
                <div className={styles.navbarRight}>
                    {/* Theme toggle slider */}
                    <div className={styles.themeToggle}>
                    <span className={styles.themeLabel}>Light</span>
                        <label className={styles.switch}>
                            <input type="checkbox" checked={isDarkTheme} onChange={handleThemeChange} />
                            <span className={styles.slider}></span>
                        </label>
                        <span className={styles.themeLabelRight}>Dark</span>
                    </div>

                   

                    <button className={styles.shareBtn} onClick={() => setIsShareModalOpen(true)}>
                      Share
                    </button>
                    {isShareModalOpen && <ShareModal onClose={() => setIsShareModalOpen(false)} />}


            
          
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.folders}>
                    <button className={styles.createOpen} onClick={openCreateModal}>
                        <img src="/icons/folder-create.png" alt="folder icon" />
                        <span>Create a folder</span>
                    </button>
                    <FolderButton
                        folders={allFolder}
                        onDelete={(id) => openDeleteModal(id)}
                    />
                </div>
                <div className={styles.forms}>
                    <Link to="/workspace" className={styles.card}>
                        <img src="/icons/plus.png" alt="plus icon" />
                        <span>Create a typebot</span>
                    </Link>
                    <FormCard
                        forms={allForm}
                        onDelete={(id, type) => openDeleteModal(id, type)}
                    />
                    {isCreateModalOpen &&
                        <CreateFolderModal
                            folderName={folderName}
                            folderNameError={folderNameError}
                            onNameChange={(e) => setFolderName(e.target.value)}
                            onCreate={createFolder}
                            onClose={() => setCreateModalOpen(false)}
                        />
                    }
                    {isDeleteModalOpen &&
                        <DeleteModal
                            entityType={entityType}
                            onDelete={entityType === "folder" ? deleteFolder : deleteForm}
                            onClose={() => setDeleteModalOpen(false)}
                        />
                    }
                </div>
            </div>
        </main>
    );
}

export default Dashboard;