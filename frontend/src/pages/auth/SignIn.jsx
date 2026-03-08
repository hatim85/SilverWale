import React, { useState } from 'react'
import { FaEye, FaEyeSlash, FaHome } from 'react-icons/fa';
import { Alert } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signInStart, signInSuccess, signInFailure } from '../../redux/slices/userSlice.js'
import { toast } from 'react-toastify';

function SignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const { loading, error: errorMessage } = useSelector(state => state.user);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            return dispatch(signInFailure('Please fill the required details'));
        }
        try {
            dispatch(signInStart());
            const res = await fetch(`${import.meta.env.VITE_PORT}/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(signInFailure(data.message));
                toast.error(data.message);
            }
            if (res.ok) {
                dispatch(signInSuccess(data));
                localStorage.setItem("token", data.token);
                toast.success("Login Successful");
                navigate('/');
            }
        }
        catch (error) {
            dispatch(signInFailure(error.message));
            toast.error(error.message);
        }

    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header / Logo Section */}
            <div className='flex items-center justify-between px-8 py-6 border-b border-gray-50'>
                <Link to="/" className="flex items-center space-x-2 text-gray-500 hover:text-black transition-colors uppercase tracking-widest text-[10px] font-bold">
                    <FaHome className='h-3 w-3' />
                    <span>Home</span>
                </Link>
                <Link to="/" className='text-2xl md:text-3xl font-serif tracking-[0.3em] uppercase text-black'>SilverWale</Link>
                <div className="w-16"></div> {/* Spacer */}
            </div>

            <div className='flex-grow flex'>
                {/* Left: Aesthetic Image */}
                <div className='hidden lg:block lg:w-1/2 relative overflow-hidden'>
                    <img src="./LoginImg.jpeg" alt="Luxury Jewellery" className='w-full h-full object-cover grayscale-[0.2] hover:scale-105 transition-transform duration-1000' />
                    <div className="absolute inset-0 bg-black/5"></div>
                </div>

                {/* Right: Login Form */}
                <div className='w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16'>
                    <div className='w-full max-w-md space-y-12'>
                        <div className="space-y-4">
                            <h1 className='text-4xl font-serif italic text-gray-800 tracking-tight'>Welcome Back</h1>
                            <p className="text-gray-400 text-sm tracking-wide">Please enter your details to sign in to your account.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className='space-y-2 group'>
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-black transition-colors">Email Address</label>
                                <input
                                    type="email"
                                    placeholder='name@example.com'
                                    id='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    className='w-full border-b border-gray-200 py-3 outline-none focus:border-black transition-colors bg-transparent text-sm placeholder:text-gray-200'
                                />
                            </div>

                            <div className='space-y-2 group relative'>
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-black transition-colors">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder='Min. 8 characters'
                                        id='password'
                                        value={formData.password}
                                        onChange={handleChange}
                                        className='w-full border-b border-gray-200 py-3 outline-none focus:border-black transition-colors bg-transparent text-sm placeholder:text-gray-200 pr-10'
                                    />
                                    <button 
                                        type="button"
                                        onClick={togglePasswordVisibility} 
                                        className='absolute right-0 bottom-3 text-gray-400 hover:text-black transition-colors'
                                    >
                                        {showPassword ? <FaEye className="h-4 w-4" /> : <FaEyeSlash className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <button 
                                className='w-full bg-black text-white py-4 rounded-sm text-xs font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98] disabled:bg-gray-400'
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="pt-8 text-center border-t border-gray-50">
                            <p className="text-gray-400 text-xs tracking-widest uppercase">
                                New to SilverWale? <Link to='/signup' className='text-black font-bold border-b border-black hover:pb-1 transition-all ml-1'>Create Account</Link>
                            </p>
                        </div>

                        {errorMessage && (
                            <div className="bg-red-50 text-red-600 p-4 text-xs font-medium border border-red-100 animate-fadeIn">
                                {errorMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn