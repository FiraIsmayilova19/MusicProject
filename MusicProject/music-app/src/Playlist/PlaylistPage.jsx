import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PlaylistPage.css';
import { FaPlay, FaPause, FaDownload, FaTrash } from 'react-icons/fa';

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dh9tyjbpv';
const PlaylistPage = () => {
  const [playlist, setPlaylist] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:7093/api/Music/playlist/${userId}`)
      .then(res => setPlaylist(res.data))
      .catch(err => console.error('Playlist alınarkən xəta:', err));
  }, [userId]);

  const playMusic = (musicUrl, id) => {
    if (playingId === id && currentAudio) {
      currentAudio.pause();
      setPlayingId(null);
      setCurrentAudio(null);
    } else {
      if (currentAudio) currentAudio.pause();
      const audio = new Audio(musicUrl);
      audio.play();
      setCurrentAudio(audio);
      setPlayingId(id);
      audio.onended = () => {
        setPlayingId(null);
        setCurrentAudio(null);
      };
    }
  };

  const downloadMusic = (url, title) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeFromPlaylist = (musicId) => {
    axios.delete(`http://localhost:7093/api/Music/playlist/${userId}/${musicId}`)
      .then(() => {
        setPlaylist(prev => prev.filter(m => m.id !== musicId));
      })
      .catch(err => {
        console.error('Silinərkən xəta:', err);
        alert('Mahnı silinərkən xəta baş verdi.');
      });
  };

  return (
    <div className="music-page">
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>🎵 Playlist</h2>
      <div className="music-grid">
        {playlist.map((music) => (
          <div className="music-card" key={music.id}>
            <div className="music-header">
              <img
                src={`${CLOUDINARY_BASE}/image/upload/${music.coverImagePublicId}.jpg`}
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
              <button onClick={() => playMusic(`${CLOUDINARY_BASE}/video/upload/${music.cloudinaryPublicId}.mp3`, music.id)}>
                {playingId === music.id ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={() => downloadMusic(`${CLOUDINARY_BASE}/video/upload/${music.cloudinaryPublicId}.mp3`, music.title)}>
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
