import React from 'react';

import collage1 from '../../assets/collage_img_1.jpg';
import collage2 from '../../assets/collage_img_2.jpg';
import collage3 from '../../assets/collage_img_3.jpg';

const KGNSelections = () => {
    return (
        <section className='w-full py-20 px-4 bg-white'>
            <div className='max-w-7xl mx-auto'>
                <div className='text-center mb-12'>
                    <h2 className='text-3xl md:text-4xl font-serif tracking-[0.2em] text-black uppercase mb-3'>SilverWale Selections</h2>
                    <p className='text-gray-500 font-light tracking-widest text-sm uppercase'>Explore our newly launched collection</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className='overflow-hidden group cursor-pointer relative'>
                        <img
                            src={collage1}
                            alt='SilverWale Selection 1'
                            className='w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105'
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                    </div>

                    <div className='flex flex-col gap-8'>
                        <div className='overflow-hidden group cursor-pointer relative'>
                            <img
                                src={collage2}
                                alt='SilverWale Selection 2'
                                className='w-full h-[234px] object-cover transition-transform duration-700 group-hover:scale-105'
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                        </div>
                        <div className='overflow-hidden group cursor-pointer relative'>
                            <img
                                src={collage3}
                                alt='SilverWale Selection 3'
                                className='w-full h-[234px] object-cover transition-transform duration-700 group-hover:scale-105'
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KGNSelections;
