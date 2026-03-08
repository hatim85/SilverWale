import React from 'react';
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <>
      <div className='flex py-5'><Link to='/'><FaHome className='h-6 w-6 m-5' /></Link><h1 className='text-4xl font-bold mx-auto my-auto tracking-widest font-serif'>SilverWale</h1></div><hr />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center uppercase tracking-widest">About us</h1>
        <div className="text-lg max-w-2xl mx-auto space-y-6 text-gray-700 leading-relaxed font-light">
          <p>
            SilverWale is dedicated to providing high-quality jewellery to customers of all levels.
            Our mission is to inspire and empower individuals to achieve their style goals
            by offering top-notch pieces at affordable prices.
          </p>
          <p>
            At SilverWale, we believe in the power of beautiful jewellery to bring people together,
            foster confidence, and promote a stylish lifestyle. Whether you're looking for something elegant
            or just starting your collection, we have everything you need to shine.
          </p>
          <p>
            Our curated selection of jewellery includes pieces for a wide range of occasions,
            from weddings and festivals to daily wear and special gifts. We carefully source our products from
            trusted manufacturers to ensure durability, beauty, and style.
          </p>
          <p>
            Thank you for choosing SilverWale as your partner in achieving your style dreams.
            We look forward to serving you and being a part of your fashion adventures.
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
