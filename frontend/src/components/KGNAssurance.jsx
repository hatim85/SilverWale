import React from 'react';
import icon1 from '../../assets/Icon1_assurance.svg';
import icon2 from '../../assets/Icon2_assurance.svg';
import icon3 from '../../assets/Icon3_assurance.svg';

const KGNAssurance = () => {
    const assurances = [
        {
            icon: icon1,
            title: "Quality Craftsmanship",
            description: "Expertly crafted with precision and care"
        },
        {
            icon: icon2,
            title: "Ethically Sourced",
            description: "Responsibly sourced materials and gems"
        },
        {
            icon: icon3,
            title: "100% Transparency",
            description: "Clear pricing and honest product information"
        }
    ];

    return (
        <section className='w-full py-24 px-4 bg-[#f8f8f8] border-y border-gray-100'>
            <div className='max-w-7xl mx-auto'>
                <div className='text-center mb-16'>
                    <h2 className='text-3xl md:text-4xl font-serif tracking-[0.2em] text-black uppercase mb-4'>SilverWale Assurance</h2>
                    <p className='text-gray-500 font-light tracking-[0.15em] uppercase text-xs md:text-sm'>Your trust is our most precious asset</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                    {assurances.map((assurance, index) => (
                        <div key={index} className='text-center group px-4'>
                            <div className='flex justify-center mb-8'>
                                <div className='w-20 h-20 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300'>
                                    <img
                                        src={assurance.icon}
                                        alt={assurance.title}
                                        className='w-10 h-10 grayscale'
                                    />
                                </div>
                            </div>
                            <h3 className='text-sm font-bold tracking-[0.2em] text-black uppercase mb-4 group-hover:tracking-[0.25em] transition-all'>
                                {assurance.title}
                            </h3>
                            <p className='text-gray-500 text-xs md:text-sm leading-relaxed font-light max-w-[250px] mx-auto'>
                                {assurance.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KGNAssurance;
