import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsLoggedIn(true);
                try {
                    const response = await axios.get('https://proviewz.onrender.com/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUserId(response.data._id);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setUserId(null);
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 p-4 flex justify-between items-center">
            <Link to="/" className="text-white text-lg font-bold">ProViewz</Link>
            <div className="flex space-x-4 items-center">
                {isLoggedIn ? (
                    <>
                        <Link to="/notifications" className="text-white">
                            <i className="fas fa-bell"></i>
                        </Link>
                        <Link to="/create-post" className="text-white">
                            <i className="fas fa-plus"></i>
                        </Link>
                        <Link to={`/user/${userId}`} className="text-white">
                            <i className="fas fa-user"></i>
                        </Link>
                        <button onClick={handleLogout} className="text-white">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/signup" className="text-white">Sign Up</Link>
                        <Link to="/login" className="text-white">Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;