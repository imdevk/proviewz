import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('https://proviewzb.onrender.com/posts');
                setPosts(response.data.posts);
                console.log(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError('Failed to fetch posts. Please try again later.');
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">All Posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4">
                            <div className="flex items-center mb-4">
                                {post.author.profileImage ? (
                                    <img
                                        src={`https://proviewzb.onrender.com/${post.author.profileImage}`}
                                        alt={post.author.name}
                                        className="w-10 h-10 rounded-full mr-3 object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                                        <span className="text-white text-sm font-bold">
                                            {getInitials(post.author.name)}
                                        </span>
                                    </div>
                                )}
                                <span className="text-sm font-bold text-gray-700">
                                    {post.author.name}
                                </span>
                            </div>
                            {post.image && (
                                <img
                                    src={`https://proviewzb.onrender.com/${post.image}`}
                                    alt={post.title}
                                    className="w-full h-48 object-contain mb-4 rounded"
                                />
                            )}
                            <h2 className="text-xl font-semibold mb-2 text-center">{post.title}</h2>
                            <p className="text-gray-600 mb-4 truncate">{post.description}</p>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-500">
                                        <i className="fas fa-heart text-red-500 mr-1"></i>
                                        {post.likes.length}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        <i className="fas fa-comment text-blue-500 mr-1"></i>
                                        {post.comments.length}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-500">
                                        <i className="fas fa-star text-yellow-500 mr-1"></i>
                                        {post.averageRating ? post.averageRating.toFixed(1) : 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <Link
                                to={`/post/${post._id}`}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 inline-block w-full text-center"
                            >
                                Know More
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllPosts;