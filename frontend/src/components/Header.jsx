import React, { useEffect, useState } from 'react'
import { FaBars, FaHeart, FaSearch, FaShoppingCart, FaTimes, FaPhoneAlt, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../redux/slices/wishlistSlice';
import ImageGallery from './ImageGallery';

function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const cartItems = useSelector(state => state.cart.cartItems);
    const { wishlistIds } = useSelector((state) => state.wishlist);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const searchString = encodeURIComponent(String(query).trim());
        if (searchString) {
            navigate(`/search?q=${searchString}`);
            setShowSearch(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchWishlist());
        }
    }, [currentUser, dispatch]);

    const navLinks = [
        { name: 'RINGS', path: '/category/ring' },
        { name: 'EARRINGS', path: '/category/earring' },
        { name: 'NECKLACES', path: '/category/necklace' },
        { name: 'BANGLES & BRACELETS', path: '/category/bangle' },
        { name: 'ENGAGEMENT & WEDDING', path: '/category/engagement' },
        { name: 'COLLECTIONS', path: '/explore' },
        { name: 'GIFTS', path: '/explore' },
    ];

    return (
        <header className="w-full bg-white sticky top-0 z-50">
            {/* Top Banner */}
            <div className="w-full bg-black text-white py-1.5 text-center text-[10px] md:text-sm font-medium tracking-widest px-4">
                BIS HALLMARKED & CERTIFIED JEWELLERY ✨
            </div>

            {/* Middle Nav Row */}
            <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between border-b border-gray-100">
                {/* Left: Contact & Hamburger */}
                <div className="flex items-center space-x-4 flex-1">
                    <button 
                        className="lg:hidden text-gray-700 hover:text-black transition-colors"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <FaBars className="h-5 w-5" />
                    </button>
                    <div className="hidden lg:flex items-center text-xs text-gray-600 space-x-2">
                        <FaPhoneAlt className="h-3 w-3" />
                        <span className="tracking-wider">+91-900-100-1313</span>
                    </div>
                </div>

                {/* Center: Logo */}
                <div className="flex-1 flex justify-center">
                    <Link to="/" className="text-2xl md:text-4xl font-serif tracking-[0.2em] text-black font-light uppercase">
                        SilverWale
                    </Link>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center justify-end space-x-4 md:space-x-6 flex-1">
                    {/* Sleek Integrated Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center border-b border-gray-200 py-1 focus-within:border-black transition-colors mr-2">
                        <input
                            type="text"
                            placeholder="SEARCH"
                            className="bg-transparent text-[10px] tracking-[0.2em] outline-none w-24 lg:w-40 px-1 font-medium placeholder:text-gray-400"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button type="submit" className="text-gray-400 hover:text-black transition-colors">
                            <FaSearch className="h-3.5 w-3.5" />
                        </button>
                    </form>

                    {/* Mobile Search Icon */}
                    <Link to="/search" className="md:hidden text-gray-700 hover:text-black transition-colors">
                        <FaSearch className="h-5 w-5" />
                    </Link>

                    <Link to={currentUser ? "/profile" : "/signin"} className="text-gray-700 hover:text-black transition-colors">
                        <FaUser className="h-5 w-5" />
                    </Link>

                    {currentUser?.userType === 'admin' && (
                        <Link to="/dashboard" title="Admin Dashboard" className="text-gray-700 hover:text-black transition-colors">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </Link>
                    )}

                    <Link to="/wishlist" className="relative text-gray-700 hover:text-black transition-colors">
                        <FaHeart className="h-5 w-5" />
                        {wishlistIds?.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#815456] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                                {wishlistIds.length}
                            </span>
                        )}
                    </Link>

                    <Link to="/cart" className="relative text-gray-700 hover:text-black transition-colors">
                        <FaShoppingCart className="h-5 w-5" />
                        {cartItems?.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Bottom Nav Row (Desktop Only) */}
            <nav className="hidden lg:block w-full border-b border-gray-100">
                <ul className="container mx-auto px-4 flex justify-center space-x-12 py-3 text-[11px] font-medium tracking-[0.15em] text-gray-700">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link 
                                to={link.path} 
                                className="hover:text-black hover:border-b hover:border-black transition-all pb-1 uppercase"
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile Drawer */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
                <div className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 overflow-y-auto ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <span className="text-xl font-serif tracking-widest uppercase">SilverWale</span>
                        <button onClick={() => setIsMenuOpen(false)}>
                            <FaTimes className="h-6 w-6 text-gray-500" />
                        </button>
                    </div>

                    {/* Image Gallery in Navbar Drawer */}
                    <div className="p-4 border-b border-gray-50">
                        <div className="rounded-lg overflow-hidden h-32 md:h-40">
                             <ImageGallery isCompact={true} />
                        </div>
                    </div>

                    <ul className="py-2">
                        {navLinks.map((link) => (
                            <li key={link.name} className="border-b border-gray-50">
                                <Link 
                                    to={link.path} 
                                    className="block px-8 py-4 text-xs font-semibold tracking-widest text-gray-800 hover:bg-gray-50 uppercase"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                        {currentUser?.userType === 'admin' && (
                            <li className="border-b border-gray-50">
                                <Link 
                                    to="/dashboard" 
                                    className="block px-8 py-4 text-sm font-medium tracking-widest text-purple-700 hover:bg-gray-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    ADMIN DASHBOARD
                                </Link>
                            </li>
                        )}
                    </ul>
                    <div className="p-8 mt-4 border-t border-gray-50">
                        <div className="flex items-center space-x-4 text-[10px] text-gray-600 uppercase tracking-widest">
                            <FaPhoneAlt className="h-3 w-3" />
                            <span>+91-900-100-1313</span>
                        </div>
                    </div>
                </div>
            </div>

        </header>
    )
}

export default Header;


