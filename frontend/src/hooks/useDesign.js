import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';

export function useDesign() {
    const navigate = useNavigate();
    const [mode, setMode] = useState('presets'); // 'presets' or 'text'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    // Design Input Data
    const [designData, setDesignData] = useState({
        client_preferences: '',
        project_details: '',
        use_pro_for_image: false,
        project_id: null
    });

    // Project Context
    const [projectId, setProjectId] = useState(null);
    const [projectTitle, setProjectTitle] = useState('');

    // Load saved state on mount
    useEffect(() => {
        const savedResult = localStorage.getItem('lastDesignResult');
        if (savedResult) {
            try {
                setResult(JSON.parse(savedResult));
            } catch (e) {
                console.error('Error loading saved design:', e);
            }
        }

        // URL Params for Project Context
        const params = new URLSearchParams(window.location.search);
        const pid = params.get('projectId');
        if (pid) {
            setProjectId(pid);
            fetchProjectDetails(pid);
        }
    }, []);

    // Save state on change
    useEffect(() => {
        if (result) {
            localStorage.setItem('lastDesignResult', JSON.stringify(result));
            localStorage.setItem('lastDesignTime', new Date().toISOString());
        }
    }, [result]);

    const fetchProjectDetails = async (pid) => {
        try {
            const res = await axios.get(`${config.apiBaseUrl}/projects/${pid}`);
            setProjectTitle(res.data.title);

            // Update data with project details
            setDesignData(prev => ({
                ...prev,
                project_id: parseInt(pid),
                project_details: `${res.data.property_type || 'Luxury Villa'} in ${res.data.location || 'Dubai'}. Area: ${res.data.area} sqm. Budget: AED ${res.data.budget?.toLocaleString()}.`
            }));
            setMode('text');
        } catch (e) {
            console.error("Failed to fetch project for design context", e);
        }
    };

    const generateFromPresets = async (presetData) => {
        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const dataToSend = {
                ...presetData,
                project_id: projectId ? parseInt(projectId) : null
            };

            const response = await axios.post(`${config.apiBaseUrl}/design/generate-by-presets`, dataToSend);
            setResult(response.data);
        } catch (err) {
            console.error('Error generating design via presets:', err);
            setError('Ошибка при генерации дизайна. Попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    const generateFromText = async () => {
        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const payload = {
                ...designData,
                project_id: projectId ? parseInt(projectId) : null
            };

            const response = await axios.post(`${config.apiBaseUrl}/design/generate`, payload);
            setResult(response.data);
        } catch (err) {
            console.error('Error generating design via text:', err);
            if (err.response?.data?.detail) {
                const details = err.response.data.detail;
                setError(Array.isArray(details) ? details.map(d => d.msg).join(', ') : details);
            } else {
                setError('Error generating design. Please check inputs.');
            }
        } finally {
            setLoading(false);
        }
    };

    const validateCompliance = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${config.apiBaseUrl}/design/validate-compliance`, designData);
            return res.data;
        } catch (err) {
            throw new Error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async () => {
        if (!result) return;
        try {
            const response = await axios.post(
                `${config.apiBaseUrl}/reports/generate`,
                {
                    project_details: { project_details: designData.project_details },
                    design_result: result
                },
                { responseType: 'blob' }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Design_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error("Error downloading report:", err);
            alert("Failed to download report");
        }
    };

    return {
        mode, setMode,
        loading,
        error,
        result,
        designData, setDesignData,
        projectTitle,
        actions: {
            generateFromPresets,
            generateFromText,
            validateCompliance,
            downloadReport
        }
    };
}
