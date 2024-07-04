import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '../config/categories'

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [pros, setPros] = useState([]);
    const [cons, setCons] = useState([]);
    const [tags, setTags] = useState([]);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`https://proviewzb.onrender.com/posts/${id}`);
                const postData = response.data;
                setPost(postData);
                setTitle(postData.title);
                setDescription(postData.description);
                setCategory(postData.category);
                setPros(postData.pros);
                setCons(postData.cons);
                setTags(postData.tags);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Failed to fetch post. Please try again later.');
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleProsChange = (index, value) => {
        const newPros = [...pros];
        newPros[index] = value;
        setPros(newPros);
    };

    const handleConsChange = (index, value) => {
        const newCons = [...cons];
        newCons[index] = value;
        setCons(newCons);
    };

    const handleAddPro = () => {
        setPros([...pros, '']);
    };

    const handleAddCon = () => {
        setCons([...cons, '']);
    };

    const handleRemovePro = (index) => {
        const newPros = pros.filter((_, i) => i !== index);
        setPros(newPros);
    };

    const handleRemoveCon = (index) => {
        const newCons = cons.filter((_, i) => i !== index);
        setCons(newCons);
    };

    const handleTagsChange = (e) => {
        setTags(e.target.value.split(',').map(tag => tag.trim()));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('pros', JSON.stringify(pros.filter(pro => pro.trim() !== ''))); // Send as JSON string
        formData.append('cons', JSON.stringify(cons.filter(con => con.trim() !== '')));  // Send as JSON string
        formData.append('tags', JSON.stringify(tags));
        if (image) {
            formData.append('image', image);
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://proviewzb-onrender.com/posts/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate(`/post/${id}`);
        } catch (error) {
            console.error('Error updating post:', error);
            setError('Failed to update post. Please try again later.');
        }
    };

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
    if (!post) return <div className="text-center mt-8">Post not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4 text-center">Edit Post</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border rounded"
                                rows="5"
                                required
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                                Category
                            </label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Pros
                            </label>
                            {pros.map((pro, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={pro}
                                        onChange={(e) => handleProsChange(index, e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePro(index)}
                                        className="ml-2 text-red-500 hover:text-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddPro}
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                            >
                                Add Pro
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Cons
                            </label>
                            {cons.map((con, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={con}
                                        onChange={(e) => handleConsChange(index, e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCon(index)}
                                        className="ml-2 text-red-500 hover:text-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddCon}
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                            >
                                Add Con
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                                Tags
                            </label>
                            <input
                                type="text"
                                id="tags"
                                value={tags.join(', ')}
                                onChange={handleTagsChange}
                                className="w-full p-2 border rounded"
                                placeholder="Enter tags separated by commas"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                                Image
                            </label>
                            <input
                                type="file"
                                id="image"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                        >
                            Update Post
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPost;