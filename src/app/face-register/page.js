'use client';

import { useEffect, useState } from 'react';
import WebcamComponent from '../../components/webcam';
import { useRouter } from 'next/navigation';

export default function FaceRegister() {
  const [username, setUsername] = useState('');
  const [images, setImages] = useState([]);
  const router = useRouter(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length < 3) {
      alert("Please capture 3 images.");
      return;
    }

    const payload = {
      name: username,
      files: images,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),  // Send JSON payload
      });

      const result = await response.json();
      if (result.status === 'registered successfully') {
        router.push('/login');
      } else {
        alert(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      alert('Registration failed');
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      router.push('/');  
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-md shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              required
            />
          </div>

          <WebcamComponent images={images} setImages={setImages} />

          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
