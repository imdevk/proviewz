import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// import HomePage from './pages/HomePage';
import Signup from './components/Signup';
import Login from './components/Login';
import UserPage from './pages/UserPage';
import EditProfile from './pages/EditProfile';
import AllPosts from './pages/AllPosts';
import SinglePost from './pages/SinglePost';
import EditPost from './pages/EditPost';
import CreatePost from './pages/CreatePost';
import { AuthProvider } from './context/AuthContext';
import SearchPosts from './pages/SearchPosts';
import NotFound from './pages/NotFound';
import axios from 'axios';

function App() {
  useEffect(() => {
    // Ping the backend when the component mounts
    axios.get('https://proviewzb.onrender.com/')
      .then(response => {
        console.log('Backend is awake');
      })
      .catch(error => {
        console.error('Error waking up backend:', error);
      });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className='font-roboto'>
          <Navbar />
          <Routes>
            <Route path='/' exact element={<AllPosts />} />
            <Route path='/signup' exact element={<Signup />} />
            <Route path='/login' exact element={<Login />} />
            <Route path='/user/:id' element={<UserPage />} />
            <Route path='/edit-profile/:id' element={<EditProfile />} />
            {/* <Route path='/posts' element={<AllPosts />} /> */}
            <Route path='/post/:id' element={<SinglePost />} />
            <Route path='/edit-post/:id' element={<EditPost />} />
            <Route path='/create-post' element={<CreatePost />} />
            <Route path='/search' element={<SearchPosts />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div >
      </Router >
    </AuthProvider>
  );
}

export default App;