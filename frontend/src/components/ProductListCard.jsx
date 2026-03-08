import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { FaHeart, FaRegHeart, FaChevronRight, FaRegCopy } from 'react-icons/fa';

const ProductListCard = ({ product, showWishlistButton = true }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(product?.coverImageIndex ?? 0);
    const images = product?.image || [];
    const dispatch = useDispatch();
    const { wishlistIds } = useSelector((state) => state.wishlist);
    const { currentUser } = useSelector((state) => state.user);

    const isWishlisted = (productId) => wishlistIds.includes(productId);

    const handleWishlistClick = (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) {
            alert("Please login to add to wishlist");
            return;
        }
        if (isWishlisted(productId)) {
            dispatch(removeFromWishlist(productId));
        } else {
            dispatch(addToWishlist(productId));
        }
    };

    const handleNextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const currentImage = images[currentImageIndex] || images[0];

    // Dummy swatches for visual completeness as requested in the design
    const dummySwatches = [
        { color: '#C0C0C0' }, // Silver
        { color: '#E5B39B' }, // Rose Silver
        { color: '#E5D5A1' }, // Yellow Silver
        { color: '#4A4A4A' }, // Black/Oxidized Silver
    ];

    return (
        <div className="group w-full max-w-[300px] bg-white transition-all duration-300">
            <Link to={`/products/${product._id}`} className='block space-y-4'>
                {/* Image Container */}
                <div className="relative aspect-square bg-[#f9f9f9] overflow-hidden">
                    <img
                        src={currentImage ? `/${currentImage.split(/[\\/]/).pop()}` : '/ErrorImage.png'}
                        alt={product.name}
                        className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => (e.target.src = '/ErrorImage.png')}
                    />

                    {/* Next Image Arrow (Right Middle) */}
                    {images.length > 1 && (
                        <button 
                            onClick={handleNextImage}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 shadow-sm border border-gray-100 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FaChevronRight className="h-3 w-3 text-gray-600" />
                        </button>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-3 px-1">
                    <h2 className="text-[13px] md:text-sm font-light tracking-wide text-gray-600 leading-relaxed line-clamp-2 h-10">
                        {product.name}
                    </h2>
                    
                    <div className="flex flex-col space-y-3">
                        <span className="text-sm md:text-base font-bold text-black tracking-wider">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductListCard;
