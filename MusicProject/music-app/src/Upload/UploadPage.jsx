import React, { useState } from 'react';
import axios from 'axios';
import './UploadPage.css';

const UploadPage = () => {
    const [musicFile, setMusicFile] = useState(null);
    const [posterFile, setPosterFile] = useState(null);
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const uploadToCloudinary = async (file, type) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'music_preset'); // Cloudinary'də təyin etdiyin preset adı
        data.append('cloud_name', 'dh9tyjbpv'); // Cloudinary hesabındakı cloud adı

        const url = `https://api.cloudinary.com/v1_1/dh9tyjbpv/${type}/upload`;
        const res = await axios.post(url, data);
        return res.data.public_id;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!musicFile || !posterFile || !title || !artist) {
            alert('Bütün sahələri doldurun');
            return;
        }

        setIsUploading(true);
        try {
            const musicPublicId = await uploadToCloudinary(musicFile, 'video');
            const posterPublicId = await uploadToCloudinary(posterFile, 'image');

            const payload = {
                title,
                artist,
                cloudinaryPublicId: musicPublicId,
                coverImagePublicId: posterPublicId,
                userId: localStorage.getItem('userId')
            };

            const res = await axios.post('http://localhost:7093/api/Music', payload, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            alert('Mahnı uğurla yükləndi!');
        } catch (err) {
            console.error(err);
            alert('Yükləmə zamanı xəta baş verdi');
        }
        setIsUploading(false);
    };

    return (
        <div className="upload-container">
            <h2>Mahnı Yüklə</h2>
            <form className="upload-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Başlıq"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Artist"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    required
                />
                <label>MP3 fayl:</label>
                <input
                    type="file"
                    accept=".mp3"
                    onChange={(e) => setMusicFile(e.target.files[0])}
                    required
                />
                <label>Poster şəkli:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPosterFile(e.target.files[0])}
                    required
                />
                <button type="submit" disabled={isUploading}>
                    {isUploading ? 'Yüklənir...' : 'Yüklə'}
                </button>
            </form>
        </div>
    );
};

export default UploadPage;
