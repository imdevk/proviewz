import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const SinglePost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        const fetchUserAndPost = async () => {
            try {
                const [postResponse, userResponse] = await Promise.all([
                    axios.get(`http://localhost:5000/posts/${id}`),
                    token ? axios.get('http://localhost:5000/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    }) : Promise.resolve(null)
                ]);

                setPost(postResponse.data);
                if (userResponse) {
                    setCurrentUserId(userResponse.data._id);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data. Please try again later.');
                setLoading(false);
            }
        };

        fetchUserAndPost();
    }, [id]);

    const handleLike = async () => {
        if (!isLoggedIn) {
            alert("Please log in to like this post.");
            navigate('/login');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:5000/posts/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPost(response.data);
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert("Please log in to comment.");
            navigate('/login');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:5000/posts/${id}/comment`, { comment }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPost(prevPost => ({
                ...prevPost,
                comments: response.data.comments
            }));
            setComment('');
        } catch (error) {
            console.error('Error commenting on post:', error);
        }
    };

    const handleEdit = () => {
        navigate(`/edit-post/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/posts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                navigate('/');
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete post. Please try again.');
            }
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
    if (!post) return <div className="text-center mt-8">Post not found</div>;

    const isAuthor = post.author && currentUserId === post.author._id;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            {post.author && post.author.profileImage ? (
                                <img
                                    src={`http://localhost:5000/${post.author.profileImage}`}
                                    alt={post.author.name || 'Author'}
                                    className="w-10 h-10 rounded-full mr-3 object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                                    <span className="text-white text-sm font-bold">
                                        {post.author ? getInitials(post.author.name) : '?'}
                                    </span>
                                </div>
                            )}
                            <span className="text-sm font-medium text-gray-700">
                                {post.author ? post.author.name : 'Unknown Author'}
                            </span>
                        </div>
                        {isAuthor && (
                            <div>
                                <button onClick={handleEdit} className="text-blue-500 hover:text-blue-600 mr-2">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button onClick={handleDelete} className="text-red-500 hover:text-red-600">
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        )}
                    </div>

                    <h1 className="text-3xl font-bold mb-4 text-center">{post.title}</h1>

                    {post.image && (
                        <img
                            src={`http://localhost:5000/${post.image}`}
                            alt={post.title}
                            className="w-full h-64 object-contain mb-4 rounded"
                        />
                    )}

                    <p className="text-gray-700 mb-6">{post.description}</p>

                    <div className="flex mb-6">
                        <div className="w-1/2 pr-2">
                            <h3 className="font-semibold mb-2">Pros:</h3>
                            <ul className="list-disc pl-5">
                                {post.pros.map((pro, index) => (
                                    <li key={index} className="text-gray-700">{pro}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-1/2 pl-2">
                            <h3 className="font-semibold mb-2">Cons:</h3>
                            <ul className="list-disc pl-5">
                                {post.cons.map((con, index) => (
                                    <li key={index} className="text-gray-700">{con}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-center mb-4">
                        <button
                            onClick={handleLike}
                            className={`flex items-center mr-4 ${isLoggedIn ? 'text-blue-500 hover:text-blue-600' : 'text-gray-500'}`}
                        >
                            <i className="fas fa-heart mr-1"></i>
                            <span>{post.likes.length} Likes</span>
                        </button>
                        <span className="text-gray-500">
                            <i className="fas fa-comment mr-1"></i>
                            {post.comments.length} Comments
                        </span>
                    </div>

                    {isLoggedIn && (
                        <form onSubmit={handleComment} className="mb-6">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full p-2 border rounded"
                                rows="3"
                            ></textarea>
                            <button
                                type="submit"
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                            >
                                Post Comment
                            </button>
                        </form>
                    )}

                    <div>
                        <h3 className="font-semibold mb-2">Comments:</h3>
                        {post.comments.map((comment, index) => (
                            <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                                <div className="flex items-center mb-2">
                                    {comment.user && comment.user.profileImage ? (
                                        <img
                                            src={`http://localhost:5000/${comment.user.profileImage}`}
                                            alt={comment.user.name || 'User'}
                                            className="w-8 h-8 rounded-full mr-2 object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                                            <span className="text-gray-600 text-xs font-bold">
                                                {comment.user ? getInitials(comment.user.name) : '?'}
                                            </span>
                                        </div>
                                    )}
                                    <span className="font-medium">{comment.user ? comment.user.name : 'Unknown User'}</span>
                                </div>
                                <p className="ml-10">{comment.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SinglePost;