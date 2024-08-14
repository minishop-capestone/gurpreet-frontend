import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { user, login, loginAsAdmin } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate("/");
      }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://gurpreet-backend.onrender.com/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                return navigate("/");

            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Failed to update password');
        }
    };

    return (
        <main className={`content login-content`}>
            <div className="login-page">
                <div className="login-container">
                    <h1>Mini shop Login</h1>
                    <p>Enter your email and new password.</p>
                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}
                        {message && <div className="success-message">{message}</div>}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">New Password</label>
                            <input type="password" id="password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </div>
                        <button className='login-button' type="submit">Update Password</button>
                    </form>
                    <div className="signup-container">
                        <a href="/Login">Back to Login?</a>
                        <a href="/Signup">Create new account?</a>
                    </div>
                </div>
            </div>
        </main>

    );
};

export default ForgotPassword;
