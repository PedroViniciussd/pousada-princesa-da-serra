'use client';

import { motion } from 'framer-motion';

export default function Tabs({ active, setActive, tabs }) {
    return (
        <div className="flex justify-center gap-4">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => setActive(tab)}
                    className={`relative px-5 py-2 font-semibold rounded-full transition-colors duration-300 ${active === tab ? 'text-black bg-[#FFD675]' : 'text-white bg-gray-800 hover:bg-gray-700'
                        }`}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {active === tab && (
                        <motion.div
                            layoutId="tabHighlight"
                            className="absolute inset-0 rounded-full bg-[#FFD675] -z-10"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
}
