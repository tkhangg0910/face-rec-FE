'use client';

import WebcamLogin from "@/components/webcam_login";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {  
    const router = useRouter(); 
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (username) {
          localStorage.setItem('username', username);
          router.push('/');
        }
      }, [username]);
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
                    Login
                </h2>
                <WebcamLogin setUsername={setUsername}></WebcamLogin>
                <p className="mt-4 text-sm text-center text-gray-600">
            Haven't had account yet?{" "}
                <a href="/face-register" className="text-indigo-500 hover:underline">
                Sign Up
                </a>
            </p>
            </div>
        </div>
    );
}