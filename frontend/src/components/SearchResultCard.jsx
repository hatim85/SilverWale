import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function SearchResultCard({ product }) {
    const { wishlistIds } = useSelector((state) => state.wishlist);
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();

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

    const coverIdx = product?.coverImageIndex ?? 0;
    const filename = product?.image?.[coverIdx] || product?.image?.[0];
    const displayImg = filename ? `/${filename.split(/[\\/]/).pop()}` : '/ErrorImage.png';

    return (
        <div className="group relative bg-white border border-gray-100 rounded-sm overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
            <Link to={`/products/${product._id}`} className="block flex-grow">
                {/* Image Container with Fixed Aspect Ratio */}
                <div className="relative aspect-square bg-[#f9f9f9] overflow-hidden">
                    <img
                        src={displayImg}
                        alt={product.name}
                        className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => (e.target.src = '/ErrorImage.png')}
                    />
                    
                    {/* Floating Wishlist Button */}
                    <button
                        onClick={(e) => handleWishlistClick(e, product._id)}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                    >
                        {isWishlisted(product._id) ? (
                            <FaHeart className="h-4 w-4 text-black" />
                        ) : (
                            <FaRegHeart className="h-4 w-4 text-gray-400 hover:text-black" />
                        )}
                    </button>
                </div>

                {/* Product Content */}
                <div className="p-5 space-y-3">
                    <div className="space-y-1">
                        <h3 className="text-[13px] font-medium tracking-wide text-gray-900 leading-snug line-clamp-2 h-10 group-hover:text-gray-600 transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-medium">
                            {product.categoryName || 'Jewellery'}
                        </p>
                    </div>

                    <div className="flex items-center space-x-3 pt-2 border-t border-gray-50">
                        <span className="text-sm font-bold text-black tracking-wider">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-gray-400 line-through tracking-wider">
                            ₹{Number(product.price + 500).toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default SearchResultCard;
