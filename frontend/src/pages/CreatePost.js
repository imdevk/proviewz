import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [pros, setPros] = useState(['']);
    const [cons, setCons] = useState(['']);
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('pros', JSON.stringify(pros.filter(pro => pro.trim() !== '')));
        formData.append('cons', JSON.stringify(cons.filter(con => con.trim() !== '')));
        if (image) {
            formData.append('image', image);
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('https://proviewz.onrender.com/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate('/posts'); // Redirect to home page or post list
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Failed to create post. Please try again later.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4 text-center">Create New Post</h1>
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
                            Create Post
                        </button>
                    </form>
                    {error && <div className="mt-4 text-red-500">{error}</div>}
                </div>
            </div>
        </div>
    );
};

export default CreatePost;