import { useState, useEffect } from 'react';
import { Activity, CheckCircle2, XCircle, Server } from 'lucide-react';
import axiosInstance from './lib/axios';

function App() {
    const [healthStatus, setHealthStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHealthStatus();
    }, []);

    const fetchHealthStatus = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get('/api/v1/health');
            setHealthStatus(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch health status');
            console.error('Health check error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        E-Commerce Platform
                    </h1>
                    <p className="text-gray-600">
                        Production-Ready Monorepo with AdminJS
                    </p>
                </div>

                {/* Health Status Card */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-primary-600" />
                            Backend Health Status
                        </h2>
                        <button
                            onClick={fetchHealthStatus}
                            className="btn btn-primary text-sm"
                            disabled={loading}
                        >
                            {loading ? 'Checking...' : 'Refresh'}
                        </button>
                    </div>

                    {loading && !healthStatus && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-900">Connection Error</h3>
                                <p className="text-red-700 text-sm mt-1">{error}</p>
                            </div>
                        </div>
                    )}

                    {healthStatus && (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-green-900">
                                        {healthStatus.message}
                                    </h3>
                                    <p className="text-green-700 text-sm mt-1">
                                        Status: {healthStatus.status}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Server className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-600">
                                            Environment
                                        </span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {healthStatus.environment}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Activity className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-600">
                                            Timestamp
                                        </span>
                                    </div>
                                    <p className="text-sm font-mono text-gray-900">
                                        {new Date(healthStatus.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {healthStatus.adminPanel && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <a
                                        href={healthStatus.adminPanel}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary w-full justify-center flex items-center gap-2"
                                    >
                                        <Server className="w-4 h-4" />
                                        Open Admin Panel
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Tech Stack Info */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-2xl mb-2">⚛️</div>
                        <p className="text-sm font-medium text-gray-900">React</p>
                        <p className="text-xs text-gray-500">Frontend</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-2xl mb-2">🚀</div>
                        <p className="text-sm font-medium text-gray-900">Vite</p>
                        <p className="text-xs text-gray-500">Build Tool</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-2xl mb-2">🟢</div>
                        <p className="text-sm font-medium text-gray-900">Node.js</p>
                        <p className="text-xs text-gray-500">Backend</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                        <div className="text-2xl mb-2">🐘</div>
                        <p className="text-sm font-medium text-gray-900">PostgreSQL</p>
                        <p className="text-xs text-gray-500">Database</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
