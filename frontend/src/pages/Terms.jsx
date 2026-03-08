import React from 'react';
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <>
    <div className='flex py-5'><Link to='/'><FaHome className='h-6 w-6 m-5'/></Link><h1 className='text-4xl font-bold mx-auto my-auto tracking-widest font-serif'>SilverWale</h1></div><hr/>
    <div className="container mx-auto py-5 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center uppercase tracking-widest">Terms & Conditions</h1>
      <div className="max-w-3xl mx-auto space-y-6 text-gray-700 font-light leading-relaxed">
        <p className="text-lg">
          By accessing and using SilverWale (the "Service"), you agree to be bound by these Terms and Conditions. Please read them carefully before using the Service.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 uppercase tracking-wide">1. Use of the Service</h2>
        <p className="text-lg">
          You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms and Conditions.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 uppercase tracking-wide">2. User Account</h2>
        <p className="text-lg">
          You may be required to create an account to access certain features of the Service. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 uppercase tracking-wide">3. Intellectual Property</h2>
        <p className="text-lg">
          The Service and its original content, features, and functionality are owned by SilverWale and are protected by international copyright, trademark, and other intellectual property laws.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 uppercase tracking-wide">4. Limitation of Liability</h2>
        <p className="text-lg">
          To the fullest extent permitted by law, SilverWale shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the Service.
        </p>
        <h2 className="text-2xl font-semibold text-gray-900 uppercase tracking-wide">5. Governing Law</h2>
        <p className="text-lg">
          These Terms and Conditions shall be governed by and construed in accordance with the laws of India.
        </p>
        <p className="text-lg italic pt-8 border-t border-gray-100">
          If you have any questions or concerns about these Terms and Conditions, please contact us at legal@silverwale.com.
        </p>
      </div>
    </div>
    </>
  );
};

export default Terms;
