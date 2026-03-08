import React from 'react';
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FaqPage = () => {
  return (
    <>
    <div className='flex py-5'><Link to='/'><FaHome className='h-6 w-6 m-5'/></Link><h1 className='text-4xl font-bold mx-auto my-auto tracking-widest font-serif'>SilverWale</h1></div><hr/>
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center uppercase tracking-widest">Frequently Asked Questions</h1>
      <div className="max-w-3xl mx-auto space-y-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. How do I sign in to SilverWale?</h2>
          <p className="text-lg text-gray-700 font-light">To sign in to SilverWale, simply click on the "Sign In" button on the header. You can create an account using your email or sign in if you already have one.</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Is my personal information safe with SilverWale?</h2>
          <p className="text-lg text-gray-700 font-light">Yes, we take the security and privacy of your personal information very seriously. We use secure encryption and industry-standard practices to protect your data.</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. What is the SilverWale assurance?</h2>
          <p className="text-lg text-gray-700 font-light">Every piece from SilverWale is BIS Hallmarked and comes with a certificate of authenticity. We ensure the highest quality standards for our silver and diamond jewellery.</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. How do I track my order?</h2>
          <p className="text-lg text-gray-700 font-light">You can track your order by visiting the "My Orders" section in your profile dashboard. You will also receive email notifications with tracking details once your order is shipped.</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. What should I do if I encounter any issues?</h2>
          <p className="text-lg text-gray-700 font-light">If you encounter any issues, please reach out to our support team at support@silverwale.com. We'll be happy to assist you and resolve any problems you may be experiencing.</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default FaqPage;
