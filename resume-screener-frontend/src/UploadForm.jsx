import { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

function UploadForm({ onAnalysisComplete }) {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Select a resume PDF to continue');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('job_description', jobDescription);
            formData.append('user_name', userName);

            const uploadRes = await axios.post(`${API_BASE}/upload-resume/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const analyzeRes = await axios.post(`${API_BASE}/analyze/${uploadRes.data.id}/`);
            onAnalysisComplete(analyzeRes.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-br from-primary to-indigo-400 px-8 py-10 mb-8 text-white shadow-xl shadow-indigo-200">
                <p className="font-display text-sm tracking-wide opacity-80 mb-2">AI RESUME SCREENER</p>
                <h1 className="font-display text-3xl font-bold leading-tight">
                    Beat the bots. Get your ATS score in seconds.
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-lg shadow-indigo-100 space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Your name</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full bg-primary-soft rounded-xl px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-primary transition"
                        placeholder="Tulsi Zala"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Resume (PDF)</label>
                    <label className="flex items-center justify-between rounded-xl px-4 py-4 cursor-pointer bg-primary-soft hover:bg-indigo-100 transition border-2 border-dashed border-primary/30">
                        <span className="text-sm text-ink-soft truncate">
                            {file ? file.name : 'Tap to upload your resume'}
                        </span>
                        <span className="text-lg">📄</span>
                        <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="hidden" required />
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-ink mb-1.5">Job description</label>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        rows={4}
                        className="w-full bg-primary-soft rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary transition"
                        placeholder="Paste the role you're targeting for a sharper match..."
                    />
                </div>

                {error && <p className="text-sm text-flag font-medium">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-primary text-white font-display font-semibold py-3.5 hover:bg-indigo-700 disabled:opacity-40 transition shadow-lg shadow-indigo-200"
                >
                    {loading ? 'Scanning your resume…' : 'Analyze my resume →'}
                </button>
            </form>
        </div>
    );
}

export default UploadForm;