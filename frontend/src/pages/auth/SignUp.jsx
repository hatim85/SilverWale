import React, { useState } from 'react'
import { FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

function SignUp() {
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isFormValid = formData.username && formData.email && formData.password && formData.confirmPassword && formData.phone;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirmPassword){
      toast.error('Passwords do not match');
      return setErrorMessage('Passwords do not match');
    }
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
      toast.error('Please fill out all fields');
      return setErrorMessage('Please fill out all fields');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(`${import.meta.env.VITE_PORT}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        toast.success('Account created successfully');
        navigate('/signin');
      }
    }
    catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
    }
    finally {
      setLoading(false)
    }
  }
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
              <img src="./LoginImg.jpeg" alt="Luxury Jewellery" className='w-full h-full object-cover grayscale-[0.2]' onError={(e) => e.target.src = './ErrorImage.png'} />
              <div className="absolute inset-0 bg-black/5"></div>
          </div>

          {/* Right: Signup Form */}
          <div className='w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16'>
              <div className='w-full max-w-md space-y-10'>
                  <div className="space-y-4">
                      <h1 className='text-4xl font-serif italic text-gray-800 tracking-tight'>Create Account</h1>
                      <p className="text-gray-400 text-sm tracking-wide">Join SilverWale to explore our exclusive collection.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-1'>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Username</label>
                            <input
                                type="text"
                                placeholder='Your Name'
                                id='username'
                                value={formData.username}
                                onChange={handleChange}
                                className='w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm'
                            />
                        </div>
                        <div className='space-y-1'>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone</label>
                            <input
                                type="number"
                                placeholder='+91...'
                                id='phone'
                                value={formData.phone}
                                onChange={handleChange}
                                className='w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm'
                            />
                        </div>
                      </div>

                      <div className='space-y-1'>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                          <input
                              type="email"
                              placeholder='email@example.com'
                              id='email'
                              value={formData.email}
                              onChange={handleChange}
                              className='w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm'
                          />
                      </div>

                      <div className='space-y-1'>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Password</label>
                          <input
                              type="password"
                              placeholder='••••••••'
                              id='password'
                              value={formData.password}
                              onChange={handleChange}
                              className='w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm'
                          />
                      </div>

                      <div className='space-y-1'>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Confirm Password</label>
                          <input
                              type="password"
                              placeholder='••••••••'
                              id='confirmPassword'
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className='w-full border-b border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm'
                          />
                      </div>

                      <button 
                          className='w-full bg-black text-white py-4 rounded-sm text-xs font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-lg mt-4'
                          disabled={loading}
                      >
                          {loading ? 'Registering...' : 'Complete Registration'}
                      </button>
                  </form>

                  <div className="pt-8 text-center border-t border-gray-50">
                      <p className="text-gray-400 text-xs tracking-widest uppercase">
                          Already have an account? <Link to='/signin' className='text-black font-bold border-b border-black hover:pb-1 transition-all ml-1'>Sign In</Link>
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

export default SignUp