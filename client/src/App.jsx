import { useState, useEffect } from 'react';
import api from './lib/axios';

function App() {
    const [health, setHealth] = useState('Loading...');

    useEffect(() => {
        api.get('/api/v1/health')
            .then(res => setHealth(JSON.stringify(res.data, null, 2)))
            .catch(err => setHealth('Error connecting to server'));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">E-Commerce App</h1>
                <div className="p-4 bg-gray-50 rounded border border-gray-200">
                    <p className="text-sm font-semibold text-gray-500 mb-2">Backend Status:</p>
                    <pre className="text-xs text-green-600 font-mono whitespace-pre-wrap">
                        {health}
                    </pre>
                </div>
                <div className="mt-6 flex gap-4">
                    <a href="/admin" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                        Go to Admin Panel
                    </a>
                </div>
            </div>
        </div>
    );
}

export default App;
