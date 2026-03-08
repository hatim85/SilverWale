import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MostLoved = () => {
    const products = [
        {
            id: 1,
            name: "Lab-Grown Basket-Set Solitaire Diamond Stud Earrings",
            price: "₹7,998 - ₹10,33,026",
            image: "/ring_6.png",
            link: "/products/1"
        },
        {
            id: 2,
            name: "Lab-Grown Classic Round Diamond Tennis Bracelet",
            price: "₹47,853 - ₹10,48,304",
            image: "/bangle_1.jpeg",
            link: "/products/2"
        },
        {
            id: 3,
            name: "Lab-Grown East-West Bezel-Set Emerald-Cut Diamond Pendant",
            price: "₹34,553 - ₹3,48,365",
            image: "/pendant_1.png",
            link: "/products/3"
        },
        {
            id: 4,
            name: "Oval & Pear Pink Sapphire Drop Earrings With Diamond Halo",
            price: "₹97,338 - ₹9,95,695",
            image: "/ring_4.png",
            link: "/products/4"
        },
        {
            id: 5,
            name: "Vintage Style Diamond Engagement Ring in 18k White Silver",
            price: "₹1,25,000 - ₹5,50,000",
            image: "/ring_1.jpeg",
            link: "/products/5"
        },
        {
            id: 6,
            name: "Handcrafted Silver Bangle with Floral Engravings",
            price: "₹15,000 - ₹45,000",
            image: "/bangle_2.jpg",
            link: "/products/6"
        },
        {
            id: 7,
            name: "Elegant Diamond Tennis Necklace",
            price: "₹2,50,000 - ₹8,00,000",
            image: "/chain_1.png",
            link: "/products/7"
        },
        {
            id: 8,
            name: "Silver Plated Pendant Set with Emeralds",
            price: "₹85,000 - ₹1,20,000",
            image: "/Pendant_set_1.png",
            link: "/products/8"
        }
    ];

    const [wishlist, setWishlist] = useState({});
    const [currentSlide, setCurrentSlide] = useState(0);
    const productsPerPage = 4;
    const totalSlides = Math.ceil(products.length / productsPerPage);

    const toggleWishlist = (id) => {
        setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const visibleProducts = products.slice(
        currentSlide * productsPerPage,
        (currentSlide + 1) * productsPerPage
    );

    return (
        <section className="w-full py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-center text-3xl font-serif tracking-widest text-black mb-16">
                    Most Loved on SilverWale
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[450px]">
                    {visibleProducts.map((product) => (
                        <div key={product.id} className="group relative animate-fadeIn">
                            {/* Wishlist Icon */}
                            <button 
                                onClick={() => toggleWishlist(product.id)}
                                className="absolute top-4 right-4 z-10 text-gray-400 hover:text-black transition-colors"
                            >
                                {wishlist[product.id] ? <FaHeart className="h-5 w-5 text-black" /> : <FaRegHeart className="h-5 w-5" />}
                            </button>

                            {/* Image Container */}
                            <div className="relative aspect-square bg-[#f9f9f9] flex items-center justify-center p-8 overflow-hidden mb-6">
                                <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110"
                                />
                                
                                {/* Hover Customize Button */}
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                                    <Link 
                                        to={product.link}
                                        className="block w-full bg-black !text-white text-[10px] tracking-[0.2em] font-medium py-3 text-center uppercase hover:!text-white transition-colors"
                                    >
                                        Customize
                                    </Link>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 text-left px-2">
                                <h3 className="text-[11px] md:text-xs font-light tracking-wide text-gray-800 leading-relaxed h-10 line-clamp-2">
                                    {product.name}
                                </h3>
                                <p className="text-[11px] md:text-sm font-semibold tracking-wider text-black">
                                    {product.price}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center space-x-2 mt-12 mb-10">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                currentSlide === index ? 'bg-black w-4' : 'bg-gray-200 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>

                {/* Discover Button */}
                <div className="flex justify-center">
                    <Link 
                        to="/explore"
                        className="border border-black px-12 py-3 text-[11px] tracking-[0.3em] font-medium text-black uppercase"
                    >
                        Discover
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default MostLoved;

