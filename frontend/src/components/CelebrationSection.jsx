import React from 'react';
import { Link } from 'react-router-dom';

const CelebrationSection = () => {
    const cards = [
        {
            title: "Engagement Rings",
            image: "/ring_1.jpeg",
            link: "/category/ring"
        },
        {
            title: "Men's Jewellery",
            image: "/ring_6.png",
            link: "/category/men"
        },
        {
            title: "Gardens at Twilight",
            image: "/ring_showcase_1.jpeg",
            link: "/category/garden"
        },
        {
            title: "Bridal Jewellery",
            image: "/bangle_2.jpg",
            link: "/category/bridal"
        }
    ];

    return (
        <section className="w-full py-16 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-serif tracking-widest text-black uppercase">
                        Celebrate With SilverWale
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {cards.map((card, index) => (
                        <Link 
                            key={index}
                            to={card.link}
                            className="group relative block overflow-hidden"
                        >
                            <div className="aspect-square md:aspect-[4/5] overflow-hidden bg-gray-50">
                                <img 
                                    src={card.image} 
                                    alt={card.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    onError={(e) => { e.target.src = '/ErrorImage.png'; }}
                                />
                            </div>
                            <div className="bg-[#969696] py-4 text-center">
                                <span className="text-white text-lg font-light tracking-wide font-serif">
                                    {card.title}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CelebrationSection;
