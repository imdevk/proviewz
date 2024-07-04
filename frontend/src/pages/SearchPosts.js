import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SearchPosts = () => {
    const [query, setQuery] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`https://proviewzb-onrender.com/posts/search?query=${query}`);
            setPosts(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error searching posts:', err);
            setError('Failed to search posts. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Search Posts</h1>

            <form onSubmit={handleSearch} className="mb-8">
                <div className="flex">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search posts..."
                        className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition duration-300"
                    >
                        Search
                    </button>
                </div>
            </form>

            {loading && <div className="text-center">Loading...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {posts.map((post) => (
                    <Link to={`/post/${post._id}`} key={post._id} className="block">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden h-48">
                            {post.image ? (
                                <img
                                    src={`https://proviewzb-onrender.com/${post.image}`}
                                    alt={post.title}
                                    className="w-full h-32 object-cover"
                                />
                            ) : (
                                <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500">No Image</span>
                                </div>
                            )}
                            <div className="p-2">
                                <h3 className="text-sm font-medium truncate">{post.title}</h3>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-gray-500">{post.author.name}</span>
                                    <span className="text-xs text-yellow-500">
                                        <i className="fas fa-star mr-1"></i>
                                        {post.averageRating ? post.averageRating.toFixed(1) : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {posts.length === 0 && query && !loading && (
                <div className="text-center text-gray-500 mt-4">No posts found.</div>
            )}
        </div>
    );
};

export default SearchPosts;