import React, { useEffect, useState } from 'react';
import '../css/Account.css';
import { useAuth } from '../components/AuthContext';

function Account() {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        email: '',
        displayName: '',
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        country: '',
        city: '',
        zipCode: ''
    });
    const [selectedPage, setSelectedPage] = useState('personalInfo');
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [messageTimeout, setMessageTimeout] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`https://gurpreet-backend.onrender.com/api/users/${user.email}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setProfile(data);
                    } else {
                        setProfile({
                            email: user.email,
                            displayName: user.displayName || user.email.split('@')[0],
                            firstName: '',
                            lastName: '',
                            address: '',
                            phone: '',
                            country: '',
                            city: '',
                            zipCode: ''
                        });
                    }
                } else {
                    console.error('Error fetching profile:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [user]);

    useEffect(() => {
        if (message.text) {
            const timeout = setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 5000);
            setMessageTimeout(timeout);
        }

        return () => {
            if (messageTimeout) {
                clearTimeout(messageTimeout);
            }
        };
    }, [message]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (selectedPage === 'changePassword') {
            setPasswords((prevPasswords) => ({ ...prevPasswords, [name]: value }));
        } else {
            setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
        }
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://gurpreet-backend.onrender.com/api/users/${user.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profile)
            });
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
                setMessage({ text: 'Profile updated successfully', type: 'success' });
            } else {
                console.error('Error updating profile:', response.statusText);
                setMessage({ text: 'Failed to update profile', type: 'error' });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ text: 'Failed to update profile', type: 'error' });
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ text: 'New password and confirm password do not match', type: 'error' });
            return;
        }
        try {
            const response = await fetch(`https://gurpreet-backend.onrender.com/api/users/${user.email}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldPassword: passwords.oldPassword,
                    newPassword: passwords.newPassword
                })
            });
            if (response.ok) {
                setMessage({ text: 'Password updated successfully', type: 'success' });
                setPasswords({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                console.error('Error updating password:', response.statusText);
                setMessage({ text: 'Failed to update password', type: 'error' });
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setMessage({ text: 'Failed to update password', type: 'error' });
        }
    };

    return (
        <div>
            {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
            <nav className="account-navbar">
                <ul>
                    <li className={selectedPage === 'personalInfo' ? 'active' : ''} onClick={() => setSelectedPage('personalInfo')}>Personal Info</li>
                    {/* <li className={selectedPage === 'previousOrders' ? 'active' : ''} onClick={() => setSelectedPage('previousOrders')}>Previous Orders</li> */}
                    <li className={selectedPage === 'changePassword' ? 'active' : ''} onClick={() => setSelectedPage('changePassword')}>Change Password</li>
                </ul>
            </nav>

            {selectedPage === 'personalInfo' && (
                <div className='personal-info'>
                    <h2>Personal Information</h2>
                    <form onSubmit={handleSubmitProfile}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" value={profile.email} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Country</label>
                            <input type="text" name="country" value={profile.country} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input type="text" name="address" value={profile.address} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input type="text" name="city" value={profile.city} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Zip Code</label>
                            <input type="text" name="zipCode" value={profile.zipCode} onChange={handleChange} />
                        </div>
                        <button className='profile-button' type="submit">Save Changes</button>
                    </form>
                </div>
            )}

            {selectedPage === 'previousOrders' && (
                <div>
                    <h2>Previous Orders</h2>
                    {/* Implement previous orders content here */}
                </div>
            )}

            {selectedPage === 'changePassword' && (
                <div className='personal-info'>
                    <h2>Change Password</h2>
                    <form onSubmit={handleSubmitPassword}>
                        <div className="form-group">
                            <label>Previous Password</label>
                            <input type="password" name="oldPassword" value={passwords.oldPassword} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" name="newPassword" value={passwords.newPassword} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} />
                        </div>
                        <button className='profile-button' type="submit">Change Password</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Account;
