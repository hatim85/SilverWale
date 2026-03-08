import React from 'react';
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <>
    <div className='flex py-5'><Link to='/'><FaHome className='h-6 w-6 m-5'/></Link><h1 className='text-4xl font-bold mx-auto my-auto tracking-widest font-serif'>SilverWale</h1></div><hr/>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center uppercase tracking-widest">Privacy Policy</h1>
        <div className="max-w-3xl mx-auto space-y-6 text-gray-700 font-light leading-relaxed">
          <p className="text-lg">
            At SilverWale, we are committed to protecting the privacy and security of our users' personal information. This Privacy Policy outlines how we collect, use, and safeguard the information you provide to us when using our website and services.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900">Information We Collect</h2>
          <p className="text-lg">
            When you interact with SilverWale, we collect basic profile information including your name and email address. We also collect information related to your activity on our platform, such as the jewellery pieces you browse or purchase.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
          <p className="text-lg">
            We use the information we collect to provide and improve our services, personalize your experience, communicate with you, and analyze trends and user behavior on our platform.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900">Data Security</h2>
          <p className="text-lg">
            We take appropriate measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. We use industry-standard security technologies and procedures to ensure the security of your data.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900">Sharing of Information</h2>
          <p className="text-lg">
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required by law.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900">Updates to this Privacy Policy</h2>
          <p className="text-lg">
            We may update this Privacy Policy from time to time. We encourage you to review this Privacy Policy periodically for any updates or changes.
          </p>
          <p className="text-lg italic">
            If you have any questions or concerns about our Privacy Policy, please contact us at privacy@silverwale.com.
          </p>
        </div>
      </div>
    </>
  );
};

export default Privacy;
