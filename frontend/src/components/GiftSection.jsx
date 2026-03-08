import React from 'react';
import { Link } from 'react-router-dom';

const GiftSection = () => {
    const gifts = [
        {
            title: 'Solitaire Jewellery',
            image: '/ring_6.png', // Using available assets that look premium
            link: '/category/ring'
        },
        {
            title: 'Initials Jewellery',
            image: '/chain_1.png',
            link: '/category/necklace'
        },
        {
            title: 'Heart Jewellery',
            image: '/pendant_1.png',
            link: '/category/necklace'
        },
        {
            title: 'Smart Watch Charm',
            image: '/ring_showcase_1.jpeg',
            link: '/explore'
        }
    ];

    return (
        <section className="w-full py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-center text-xl md:text-2xl font-serif tracking-[0.2em] text-gray-800 mb-10 uppercase">
                    Gifts That Say It All
                </h2>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {gifts.map((gift, index) => (
                        <Link 
                            key={index} 
                            to={gift.link}
                            className="group flex flex-col"
                        >
                            <div className="aspect-square w-full bg-[#f8f8f8] p-6 md:p-10 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:bg-[#f0f0f0]">
                                <img 
                                    src={gift.image} 
                                    alt={gift.title}
                                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=' + gift.title; }}
                                />
                            </div>
                            <div className="w-full bg-[#8E8D8D] py-3.5 text-center">
                                <span className="text-white text-[10px] md:text-xs font-semibold tracking-[0.15em] uppercase">
                                    {gift.title}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GiftSection;
