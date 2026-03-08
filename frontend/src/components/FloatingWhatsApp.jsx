import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsApp = () => {
    const phoneNumber = "919001001313"; // Using the number from header
    const message = encodeURIComponent("Hello SilverWale! I'm interested in your jewellery collection.");
    
    return (
        <a 
            href={`https://wa.me/${phoneNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[999] bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center animate-bounce"
            title="Chat with us on WhatsApp"
        >
            <FaWhatsapp className="h-7 w-7 md:h-8 md:w-8" />
        </a>
    );
};

export default FloatingWhatsApp;
