import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { FaTrash } from 'react-icons/fa';

function Wishlist() {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.wishlist);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchWishlist());
        }
    }, [dispatch, currentUser]);

    const handleRemove = (productId) => {
        dispatch(removeFromWishlist(productId));
    };

    if (!currentUser) {
        return (
            <>
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <h2 className="text-2xl font-bold mb-4">Please log in to view your wishlist</h2>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="container mx-auto px-4 mt-8 flex-grow">
                <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && items.length === 0 && (
                    <p className="text-gray-500">Your wishlist is empty.</p>
                )}

                <div className="flex flex-wrap gap-8 justify-center">
                    {items.map((product) => (
                        <div key={product._id} className="relative">
                            <ProductCard product={product} showWishlistButton={false} />
                            <button
                                onClick={() => handleRemove(product._id)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors z-10"
                                title="Remove from Wishlist"
                            >
                                <FaTrash size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Wishlist;
