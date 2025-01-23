"use client";  
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState('');
  const [isClient, setIsClient] = useState(false);  
  
  const router = useRouter(); 
  const logout = () => {
    localStorage.removeItem('username');
    router.push('/login');
  }
  useEffect(() => {
    setIsClient(true); 

    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      router.push('/login');  
    } else {
      setUsername(storedUsername); 
    }
  }, [router]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      Welcome, {username}!
      <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
        Logout
      </button>
    </div>
  );
}
