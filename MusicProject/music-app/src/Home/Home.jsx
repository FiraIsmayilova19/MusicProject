import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleAddMusic = () => {
    navigate('/upload');
  };

  const handleGoToMusics = () => {
    navigate('/musics'); // Musiqilər səhifəsinə yönləndirmə
  };

  const handleGoToFavorites = () => {
    navigate('/favorites'); // Favorilər səhifəsinə yönləndirmə
  };

  const handleGoToPlaylist = () => {
    navigate('/playlist'); // Playlist səhifəsinə yönləndirmə
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };


  const handleGoHome = () => {
    navigate('/home');
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <h1 className="logo" onClick={handleGoHome} style={{ cursor: 'pointer' }}>
          🎵 MusicApp
        </h1>
        <ul className="nav-links">
          <li>
            <button className="nav-btn" onClick={handleGoToMusics}>Musiqilər</button>
          </li>
          <li>
            <button className="nav-btn" onClick={handleGoToFavorites}>Favorilər</button>
          </li>
          <li>
            <button className="nav-btn" onClick={handleGoToPlaylist}>Playlistim</button>
          </li>
          <li>
            <button className="nav-btn" onClick={handleLogout}>Çıxış</button>
          </li>
        </ul>
      </nav>

      <div className="hero-section">
        <h2>Xoş gəldin!</h2>
        <p>Ən sevdiyin musiqiləri kəşf et və siyahına əlavə et.</p>
        <div className="button-group">
          <button className="explore-btn" onClick={handleGoToMusics}>Kəşf et</button>
          <button className="add-music-btn" onClick={handleAddMusic}>Musiqi əlavə et</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
