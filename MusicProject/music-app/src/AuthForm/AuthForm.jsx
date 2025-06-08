import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
  });
  const navigate=useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const url = isLogin
    ? 'http://localhost:7093/api/Auth/login'
    : 'http://localhost:7093/api/Auth/register';

  try {
    const payload = isLogin
      ? { userName: form.userName, password: form.password }
      : {
          userName: form.userName,
          email: form.email,
          password: form.password,
        };

    const response = await axios.post(url, payload, { withCredentials: true });

    if (isLogin) {
      localStorage.setItem('userId', response.data.userId);
      alert(response.data.message);
      navigate('/home');
    } else {
      alert(response.data);
    }
  } catch (error) {
    console.error(error);
    alert('Xəta baş verdi: ' + (error.response?.data || 'Bilinməyən'));
  }
};



  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={form.userName}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p>
          {isLogin ? 'Hesabınız yoxdur?' : 'Hesabınız var?'}{' '}
          <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Qeydiyyat' : 'Login'} et
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
