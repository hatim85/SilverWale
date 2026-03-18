import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TheEdit = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const articles = [
        {
            image: '/ring_showcase_1.jpeg',
            title: '1 Carat Diamond Price in India 2026',
            subtitle: 'Latest Trends and Buying Advice',
            link: '#'
        },
        {
            image: '/bangle_2.jpg',
            title: 'CVD vs HPHT Lab Diamonds',
            subtitle: 'Which is Better for Your Ring?',
            link: '#'
        },
        {
            image: '/ring_6.png',
            title: 'The Art of Layering Silver',
            subtitle: 'Master the minimal look this season',
            link: '#'
        }
    ];

    return (
        <section className='w-full py-12 md:py-24 bg-white overflow-hidden'>
            <div className='max-w-6xl mx-auto px-4'>
                <div className='text-center mb-20'>
                    <h2 className='text-3xl md:text-4xl font-serif tracking-[0.3em] text-black uppercase section-title-premium'>The Edit</h2>
                </div>
 
                <div className="relative">
                    <div 
                        className="mobile-slider md:grid md:grid-cols-3 md:gap-12"
                        style={{ "--slide-transform": `calc(-${currentSlide * (100/1.5)}%)` }}
                    >
                        {articles.map((article, idx) => (
                            <div key={idx} className="mobile-slider-item md:w-full group card-hover-lift">
                                <Link to={article.link} className="block">
                                    <div className="aspect-[1.5/1.1] overflow-hidden bg-gray-50 mb-6 relative">
                                        <img 
                                            src={article.image} 
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
                                    </div>
                                    <div className="pt-4 text-center">
                                         <div className="pt-2">
                                             <span className="inline-block text-[10px] md:text-xs font-bold border-b border-black pb-1 uppercase tracking-[0.3em] transition-all hover:pr-4">
                                                 Read & Shop
                                             </span>
                                         </div>
                                     </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center space-x-2 mt-8 md:hidden">
                    {articles.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                currentSlide === idx ? 'bg-black w-4' : 'bg-gray-200'
                            }`}
                        />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link to="#" className="inline-block border border-black px-12 py-3 text-[10px] tracking-[0.3em] font-bold uppercase transition-all hover:bg-black hover:text-white">
                        Explore
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TheEdit;
