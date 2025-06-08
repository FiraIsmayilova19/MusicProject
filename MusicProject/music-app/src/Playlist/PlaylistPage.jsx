import React, { useState, useEffect } from 'react';
import { FaHeart, FaPlay, FaDownload, FaTrash } from 'react-icons/fa';
import './PlaylistPage.css';

const PlaylistPage = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    const storedPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
    setPlaylist(storedPlaylist);
  }, []);

  const playMusic = (musicUrl, id) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    if (playingId === id) {
      setPlayingId(null);
      return;
    }
    const audio = new Audio(musicUrl);
    audio.play();
    setCurrentAudio(audio);
    setPlayingId(id);
  };

  const downloadMusic = (musicUrl, title) => {
    const link = document.createElement('a');
    link.href = musicUrl;
    link.download = `${title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeFromPlaylist = (id) => {
    const updated = playlist.filter((music) => music.id !== id);
    setPlaylist(updated);
    localStorage.setItem('playlist', JSON.stringify(updated));
  };

  return (
    <div className="music-page">
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>🎵 Playlist</h2>
      <div className="music-grid">
        {playlist.map((music) => (
          <div className="music-card" key={music.id}>
            <div className="music-header">
              <img
                src={`https://res.cloudinary.com/dh9tyjbpv/image/upload/${music.coverImagePublicId}.jpg`}
                alt={music.title}
                className="poster"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-poster.jpg';
                }}
              />
            </div>
            <div className="music-info">
              <h3>{music.title}</h3>
              <p>{music.artist}</p>
            </div>
            <div className="controls">
              <button onClick={() => playMusic(`https://res.cloudinary.com/dh9tyjbpv/video/upload/${music.cloudinaryPublicId}.mp3`, music.id)}>
                {playingId === music.id ? <FaTrash /> : <FaPlay />}
              </button>
              <button onClick={() => downloadMusic(`https://res.cloudinary.com/dh9tyjbpv/video/upload/${music.cloudinaryPublicId}.mp3`, music.title)}>
                <FaDownload />
              </button>
              <button onClick={() => removeFromPlaylist(music.id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistPage;
