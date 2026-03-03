
import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

const CommunityFooter = () => {
    return (
        <div className="flex items-center justify-between pb-8 pt-4 border-t border-[var(--border-primary)] mt-8">
            <h2 className="text-[var(--text-primary)] text-lg font-bold">Join our Community</h2>
            <div className="flex items-center gap-4">
                <a href="#" className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                    <Youtube size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                    <Instagram size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                    <Facebook size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                    <Twitter size={16} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                    <Linkedin size={16} />
                </a>
            </div>
        </div>
    );
};

export default CommunityFooter;
