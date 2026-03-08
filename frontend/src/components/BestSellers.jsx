import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BestSellers = () => {
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState({});

    // Sample best seller products with multiple images
    const bestSellers = [
        {
            id: 1,
            name: "Classic Diamond Solitaire",
            category: "Rings",
            price: "₹45,999",
            images: [
                "/ring_1.jpeg",
                "/ring_2.jpeg",
                "/ring_3.jpeg"
            ],
            link: "/category/ring"
        },
        {
            id: 2,
            name: "Signature Silver Bangle",
            category: "Bangles",
            price: "₹32,499",
            images: [
                "/bangle_1.jpeg",
                "/bangle_2.jpg",
                "/bangle_3.avif"
            ],
            link: "/category/bangle"
        },
        {
            id: 3,
            name: "Elegant Pearl Drops",
            category: "Earrings",
            price: "₹18,999",
            images: [
                "/ring_4.png",
                "/ring_5.png",
                "/ring_6.png"
            ],
            link: "/category/earring"
        }
    ];

    // Handle image cycling on hover
    useEffect(() => {
        if (hoveredProduct !== null) {
            const interval = setInterval(() => {
                setCurrentImageIndex(prev => ({
                    ...prev,
                    [hoveredProduct]: (prev[hoveredProduct] || 0) === 2 ? 0 : (prev[hoveredProduct] || 0) + 1
                }));
            }, 1500);

            return () => clearInterval(interval);
        }
    }, [hoveredProduct]);

    return (
        <section className='w-full py-20 px-4 bg-white'>
            <div className='container mx-auto max-w-7xl'>
                <div className="text-center mb-16">
                    <h2 className='text-3xl font-serif tracking-widest text-black uppercase mb-4'>Best Sellers</h2>
                    <div className="w-12 h-[1px] bg-black mx-auto"></div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                    {bestSellers.map((product) => (
                        <div
                            key={product.id}
                            className="group"
                            onMouseEnter={() => setHoveredProduct(product.id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                        >
                            <Link to={product.link} className="block">
                                <div className='relative overflow-hidden aspect-[4/5] bg-gray-50'>
                                    {/* Product Images */}
                                    {product.images.map((image, imgIndex) => (
                                        <img
                                            key={imgIndex}
                                            src={image}
                                            alt={product.name}
                                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                                                (hoveredProduct === product.id && currentImageIndex[product.id] === imgIndex) || 
                                                (hoveredProduct !== product.id && imgIndex === 0)
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            }`}
                                        />
                                    ))}
                                    
                                    {/* Quick View Overlay */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                                        <button className="bg-white text-black px-8 py-2 text-xs tracking-widest uppercase font-medium hover:bg-black hover:text-white transition-all shadow-sm">
                                            Quick View
                                        </button>
                                    </div>
                                </div>

                                <div className='pt-6 text-center space-y-2'>
                                    <p className='text-[10px] tracking-[0.2em] text-gray-400 uppercase font-medium'>
                                        {product.category}
                                    </p>
                                    <h3 className='text-sm font-medium text-black tracking-wide group-hover:text-gray-600 transition-colors uppercase'>
                                        {product.name}
                                    </h3>
                                    <p className='text-sm font-bold text-black'>
                                        {product.price}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestSellers;

