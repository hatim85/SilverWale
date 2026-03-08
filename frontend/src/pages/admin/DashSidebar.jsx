import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from  "react-toastify";
import { signoutSuccess } from '../../redux/slices/userSlice';

function DashSidebar() {
    const [tab,setTab]=useState('');
    const dispatch=useDispatch();
    const navigate=useNavigate()

    const handleSignout = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_PORT}/api/user/signout`, {
          method: 'POST'
        });
        const data = await res.json();
        if (!res.ok) {
          toast.failure(data.message)
        }
        else {
          dispatch(signoutSuccess());
          localStorage.removeItem('user');
          toast.success("Signed Out Successfully")
          navigate('/')
        }
      }
      catch (error) {
        toast.error(error.message)
      }
    }

    useEffect(()=>{
        const urlParams=new URLSearchParams(location.search);
        const tabFromUrl=urlParams.get('tab');
        if(tabFromUrl){
            setTab(tabFromUrl)
        }
    },[location.search])
  return (
    <>
      <header className='bg-gray-50 border-r border-gray-100 h-full w-64 md:w-72 flex flex-col py-8 font-sans'>
        <nav className="flex-grow">
          <ul className="space-y-1">
            {[
              { label: 'Products', tab: 'products' },
              { label: 'Categories', tab: 'categories' },
              { label: 'Users', tab: 'users' },
              { label: 'Orders', tab: 'orders' }
            ].map((item) => (
              <li key={item.tab}>
                <Link 
                  to={`/dashboard?tab=${item.tab}`}
                  className={`block px-8 py-4 text-[11px] uppercase tracking-[0.2em] font-bold transition-all ${
                    tab === item.tab 
                      ? 'bg-white text-black border-r-4 border-black' 
                      : 'text-gray-400 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="px-8 pt-8 border-t border-gray-100">
          <button 
            onClick={handleSignout}
            className="w-full text-left text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>
    </>
  )
}

export default DashSidebar