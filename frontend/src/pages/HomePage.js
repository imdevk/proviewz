import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePage() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const handleAction = () => {
        if (isLoggedIn) {
            navigate('/posts');
        } else {
            navigate('/signup');
        }
    };

    return (
        <div>
            <header className="bg-gray-100 p-8 text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to ProViewz</h1>
                <p className="text-lg">
                    ProViewz is your go-to platform for honest reviews on the latest gadgets and online services.
                    Discover what people are saying, share your own experiences, and make informed decisions.
                </p>
            </header>
            <main className="p-8">
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        {isLoggedIn ? 'View Posts' : 'Sign Up Now'}
                    </h2>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleAction}
                    >
                        {isLoggedIn ? 'Go to Posts' : 'Sign Up'}
                    </button>
                </div>
            </main>
            <footer className="bg-gray-800 p-4 text-center text-white">
                <p>ProViewz - Your trusted source for gadget and service reviews.</p>
            </footer>
        </div>
    );
}

export default HomePage;