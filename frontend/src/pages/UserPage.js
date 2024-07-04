import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const UserPage = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://proviewzb.onrender.com/auth/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);

                // Check if the user is logged in and viewing their own profile
                if (token) {
                    const meResponse = await axios.get('https://proviewzb.onrender.com/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setIsOwnProfile(meResponse.data._id === id);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                if (error.response && error.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchUser();
    }, [id, navigate]);

    const handleEdit = () => {
        navigate(`/edit-profile/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`https://proviewzb.onrender.com/auth/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                localStorage.removeItem('token');
                navigate('/login');
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
                {isOwnProfile && (
                    <button onClick={handleEdit} className="absolute top-2 right-2 text-blue-500 hover:text-blue-600">
                        <i className="fas fa-edit"></i>
                    </button>
                )}
                <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>
                <div className="space-y-4">
                    <div className="text-center">
                        {user.profileImage && (
                            <img
                                src={`https://proviewzb.onrender.com/${user.profileImage}`}
                                alt="Profile"
                                className="w-24 h-24 rounded-full mx-auto mb-4"
                            />
                        )}
                        <h3 className="text-xl font-semibold">{user.name}</h3>
                        <p className="text-gray-600"><b>Email: </b>{user.email}</p>
                        <div>
                            <p className="text-gray-600"><b>Occupation: </b>{user.occupation}</p>
                            <p className="text-gray-600"><b>Location: </b>{user.location}</p>
                            <p className='text-gray-600'><b>Bio: </b>{user.bio || 'No bio available'}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2">Favorite Gadgets</h4>
                    {user.favoriteGadgets && user.favoriteGadgets.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {user.favoriteGadgets.map((gadget, index) => (
                                <li key={index} className="text-gray-600">{gadget}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No favorite gadgets listed</p>
                    )}
                </div>
                {isOwnProfile && (
                    <button
                        onClick={handleDelete}
                        className="mt-6 w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        Delete Account
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserPage;