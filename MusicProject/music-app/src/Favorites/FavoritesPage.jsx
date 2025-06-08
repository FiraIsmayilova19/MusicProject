import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FavoritesPage.css';
import { FaTrash, FaPlay, FaDownload, FaPlus } from 'react-icons/fa';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dh9tyjbpv';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:7022/api/Favorites/${userId}`)
      .then(res => setFavorites(res.data))
      .catch(err => console.error('Favorilər alınarkən xətə:', err));
  }, [userId]);

  const removeFromFavorites = async (id) => {
    try {
      await axios.delete('http://localhost:7022/api/Favorites', {
        data: { userId: Number(userId), musicId: id }
      });
      setFavorites(prev => prev.filter(m => m.musicId !== id));
      alert('Favorilərdən silindi!');
    } catch (err) {
      console.error('Favorilərdən silmə xətası:', err);
      alert('Favorilərdən silmək mümkün olmadı.');
    }
  };

  const playMusic = (pubId, id) => {
    if (currentAudio) {
      currentAudio.pause();
      if (playingId === id) {
        setPlayingId(null);
        setCurrentAudio(null);
        return;
      }
    }
    const audio = new Audio(`${CLOUDINARY_BASE_URL}/video/upload/${pubId}.mp3`);
    audio.play();
    setCurrentAudio(audio);
    setPlayingId(id);
    audio.onended = () => { setPlayingId(null); setCurrentAudio(null); };
  };

  const downloadMusic = (pubId, title) => {
    const link = document.createElement('a');
    link.href = `${CLOUDINARY_BASE_URL}/video/upload/${pubId}.mp3`;
    link.download = `${title}.mp3`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const addToPlaylist = (id) => alert(`➕ Music ${id} pleylistə əlavə olundu!`);

  if (!userId) return <p>Favoriləri görmək üçün daxil olun.</p>;

  return (
    <div className="music-page">
      <h2>Favoritlərim</h2>
      <div className="music-grid">
        {favorites.length === 0 && <p>Favorit musiqi tapılmadı.</p>}
        {favorites.map(m => (
          <div className="music-card" key={m.musicId}>
            <div className="music-header">
              <img src={`${CLOUDINARY_BASE_URL}/image/upload/${m.coverImagePublicId}.jpg`}
                   alt={m.title} className="poster"
                   onError={e => e.target.src = '/default-poster.jpg'} />
              <button className="favorite-btn active"
                      onClick={() => removeFromFavorites(m.musicId)}
                      title="Favorilərdən sil">
                <FaTrash />
              </button>
            </div>
            <div className="music-info">
              <h3>{m.title}</h3>
              <p>{m.artist}</p>
            </div>
            <div className="controls">
              <button onClick={() => playMusic(m.cloudinaryPublicId, m.musicId)}>
                {playingId === m.musicId ? <span>⏸</span> : <FaPlay />}
              </button>
              <button onClick={() => downloadMusic(m.cloudinaryPublicId, m.title)}>
                <FaDownload />
              </button>
              <button onClick={() => addToPlaylist(m.musicId)}>
                <FaPlus />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
