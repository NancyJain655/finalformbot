import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import { createFormApi, fetchFormByIdApi, updateFormApi } from "../apis/Form";
import styles from '../assets/Navbar.module.css';

function Navbar({ setWorkspaceId, updateFormSequence }) {
    const token = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [folderId, setFolderId] = useState(searchParams.get('fid'));
    const [formId, setFormId] = useState(searchParams.get('wid'));
    const [formName, setFormName] = useState('');
    const [formSequence, setFormSequence] = useState('');
    const [formNameError, setFormNameError] = useState('');
    const [theme, setTheme] = useState('dark'); 

    const createForm = async () => {
        setFormNameError('');
        if (formName.trim().length === 0) { setFormNameError('Enter form name'); return; }

        const formId = await createFormApi(folderId, formName, token);
        if (formId) {
            setFormId(formId); setWorkspaceId(formId);
            navigate(`/workspace?wid=${formId}`);
        }
    };

    const fetchFormById = async () => {
        const data = await fetchFormByIdApi(formId, token);
        if (data) {
            setFormName(data.formName);
            setFormSequence(data.formSequence);
        }
    };

    const updateForm = async () => {
        if (formName.trim().length === 0) return;

        const data = await updateFormApi(formId, { formName }, token);
        if (data) setFormName(formName);
    };

    const handleFormSave = async () => {
        if (formId) {
            if (updateFormSequence) {
                await updateFormSequence();
                fetchFormById();
            }
            await updateForm();
        } else {
            await createForm();
        }
    };

    const copyFormLink = async () => {
        const link = `${window.location.origin}/share/${formId}`;
        try {
            await navigator.clipboard.writeText(link);
            toast.success("Form link copied successfully.");
        } catch (error) {
            handleApiErr(error, navigate);
        }
    };
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };


    useEffect(() => {
        if (token) {
            if (formId) fetchFormById();
        }
    }, [token]);

    return (
        <div className={styles.navbar}>
            <div className={styles.formTitle}>
                <input type="text" className={formNameError && 'error'} value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Enter Form Name" />
            </div>
            <div className={styles.formNav}>
                <NavLink to={formId ? `/workspace?wid=${formId}` : window.location} className={({ isActive }) => isActive ? styles.active : ''}>Flow</NavLink>
               
                <NavLink to={formId ? `/response?wid=${formId}` : window.location} className={({ isActive }) => isActive && formId ? styles.active : ''}>Response</NavLink>
            </div>
            <div className={styles.sideNav}>
            <div className={styles.themeToggle}>
                    <div className={styles.themeLabel}>
                        <span className={theme === 'light' ? styles.lightLabel : ''}>Light</span>

                        <label className={styles.switch}>
                            <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                            <span className={`${styles.slider} ${theme === 'dark' ? styles.darkToggle : styles.lightToggle}`}></span>
                        </label>

                        <span className={theme === 'dark' ? styles.darkLabel : ''}>Dark</span>
                    </div>
</div>

<div className={styles.formAction}>
                <button disabled={formSequence.length == 0} onClick={copyFormLink}>Share</button>
                <button onClick={handleFormSave}>Save</button>
                <NavLink to="/dashboard"><img src="/icons/close.png" alt="close icon" /></NavLink>
            </div>
        </div>
        </div>
    )
}

export default Navbar