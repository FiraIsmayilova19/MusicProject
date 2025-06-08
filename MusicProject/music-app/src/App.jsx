import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import AuthForm from './AuthForm/AuthForm';
import Home from './Home/Home';
import UploadPage from './Upload/UploadPage';
import MusicCardPage from './MusicCard/MusicCardPage';
import FavoritesPage from './Favorites/FavoritesPage';
import PlaylistPage from './Playlist/PlaylistPage';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/musics" element={<MusicCardPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/playlist" element={<PlaylistPage />} />

        </Routes>
      </div>
    </>
  )
}

export default App
