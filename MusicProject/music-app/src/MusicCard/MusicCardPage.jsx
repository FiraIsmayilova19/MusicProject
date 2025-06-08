import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MusicPage.css';
import { FaHeart, FaRegHeart, FaPlay, FaPause, FaDownload, FaPlus } from 'react-icons/fa';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dh9tyjbpv';

const MusicCardPage = () => {
  const [musics, setMusics] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get('http://localhost:7093/api/Music')
      .then(res => {
        const mapped = res.data.map(m => ({
          ...m,
          musicUrl: `${CLOUDINARY_BASE_URL}/video/upload/${m.cloudinaryPublicId}.mp3`,
          posterUrl: `${CLOUDINARY_BASE_URL}/image/upload/${m.coverImagePublicId}.jpg`,
        }));
        setMusics(mapped);
      })
      .catch(err => console.error('Musiqilər alınarkən xəta:', err));
  }, []);

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:7093/api/Favorites/${userId}`)
      .then(res => setFavoriteIds(res.data.map(f => f.musicId)))
      .catch(err => console.error('Favorilər alınarkən xətə:', err));
  }, [userId]);

  const togglePlay = (m) => {
    if (currentAudio && playingId === m.id) {
      currentAudio.pause();
      setPlayingId(null);
      setCurrentAudio(null);
    } else {
      if (currentAudio) currentAudio.pause();
      const audio = new Audio(m.musicUrl);
      audio.play();
      setCurrentAudio(audio);
      setPlayingId(m.id);
      audio.onended = () => { setPlayingId(null); setCurrentAudio(null); };
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

  const toggleFavorite = async (m) => {
    if (!userId) {
      alert('Favorilərə əlavə etmək üçün daxil olun.');
      return;
    }
    const isFav = favoriteIds.includes(m.id);
    try {
      if (!isFav) {
        await axios.post(`http://localhost:7093/api/Favorites/${userId}`, {
          userId: userId,
          musicId: m.id
        });
        setFavoriteIds(prev => [...prev, m.id]);
      } else {
        await axios.delete(`http://localhost:7093/api/Favorites/${userId}/${m.id}`, { data: { userId: userId, musicId: m.id } });
        setFavoriteIds(prev => prev.filter(id => id !== m.id));
      }
    } catch (e) {
      console.error('Favorit əməliyyatı xətası:', e);
      alert('Favorit əməliyyatı zamanı xəta baş verdi.');
    }
  };

const addToPlaylist = async (musicId) => {
  if (!userId) {
    alert("Pleylistə əlavə etmək üçün daxil olun.");
    return;
  }

  try {
    await axios.post("http://localhost:7093/api/Music/playlist/add-music", {
      userId: userId,
      musicId: musicId
    },{withCredentials:true});
    alert("✅ Mahnı pleylistə əlavə olundu!");
  } catch (error) {
    console.error("Pleylistə əlavə edilərkən xəta:", error);
    alert("❌ Əlavə etmək mümkün olmadı.");
  }
};



  return (
    <div className="music-page">
      {musics.map(m => (
        <div className="music-card" key={m.id}>
          <div className="music-header">
            <img src={m.posterUrl} alt={m.title} className="poster" onError={e => e.target.src = '/default-poster.jpg'} />
            <button
              className={`favorite-btn ${favoriteIds.includes(m.id) ? 'active' : ''}`}
              onClick={() => toggleFavorite(m)}
              title={favoriteIds.includes(m.id) ? 'Favorilərdən çıxar' : 'Favorilərə əlavə et'}
            >
              {favoriteIds.includes(m.id) ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
          <div className="music-body">
            <h4>{m.title}</h4>
            <p>{m.artist}</p>
          </div>
          <div className="music-actions">
            <button onClick={() => togglePlay(m)}>
              {playingId === m.id ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={() => downloadMusic(m.musicUrl, m.title)}>
              <FaDownload />
            </button>
            <button onClick={() => addToPlaylist(m.id)}>
              <FaPlus />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MusicCardPage;
