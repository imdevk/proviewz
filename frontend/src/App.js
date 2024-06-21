import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Signup from './components/Signup';
import Login from './components/Login';
import UserPage from './pages/UserPage';
import EditProfile from './pages/EditProfile';
import AllPosts from './pages/AllPosts';
import SinglePost from './pages/SinglePost';
import EditPost from './pages/EditPost';
import CreatePost from './pages/CreatePost';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='font-roboto'>
          <Navbar />
          <Routes>
            <Route path='/' exact element={<HomePage />} />
            <Route path='/signup' exact element={<Signup />} />
            <Route path='/login' exact element={<Login />} />
            <Route path='/user/:id' element={<UserPage />} />
            <Route path='/edit-profile/:id' element={<EditProfile />} />
            <Route path='/posts' element={<AllPosts />} />
            <Route path='/post/:id' element={<SinglePost />} />
            <Route path='/edit-post/:id' element={<EditPost />} />
            <Route path='/create-post' element={<CreatePost />} />
          </Routes>
        </div >
      </Router >
    </AuthProvider>
  );
}

export default App;