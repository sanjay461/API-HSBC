import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
    const [token, setToken] = useState(null);
    const [view, setView] = useState('login');

    return (
        <div>
            <nav>
                <button onClick={() => setView('dashboard')}>Dashboard</button>
                <button onClick={() => setView('login')}>Login</button>
            </nav>
            {view === 'login' && <Login setToken={setToken} />}
            {view === 'dashboard' && token && <Dashboard token={token} />}
        </div>
    );
}

export default App;