// src/components/Campaign.jsx
import React, { useState } from 'react';
import './Campaign.css';

const campaigns = [
    {
        title: 'W.A.S.H. (Water, Sanitation & Hygiene)',
        description: 'A program focused on improving access to clean drinking water, proper sanitation, and hygiene education in rural schools and communities.',
        impact: 'Installed 15 clean water filtration units in government schools. Built 28 girl-friendly toilets with handwashing stations." Trained over 1,000 students in proper handwashing techniques and hygiene."',
        image: 'https://www.unicef.org/sites/default/files/styles/hero_extended/public/UNI422836.jpg.webp?itok=mtC9ZP-t',
    },
    {
        title: 'Menstrual Health Management & Reproductive Health Education',
        description: 'This campaign empowers adolescent girls with knowledge on menstrual hygiene, distributes reusable sanitary kits, and provides reproductive health workshops to students and teachers.',
        impact: 'Distributed 1,500+ reusable sanitary pads in 3 districts. Conducted 45 awareness workshops on menstrual health and myths. Trained 30 local women as MHM peer educators and health ambassadors.',
        image: 'https://www.ambujafoundation.org/blog/uploads/7346PHOTO-2021-07-30-18-18-13.jpg',
    },
    {
        title: 'Clean & Green Initiatives',
        description: 'Environmental campaigns promoting eco-conscious behavior including tree planting, clean-up drives, waste segregation, and biodiversity education.',
        impact: 'Planted over 5,000 native tree saplings in 2024 alone. Organized 20+ school-based plastic-free awareness rallies. Set up compost pits and zero-waste systems in 10 village centers.',
        image: 'https://www.sei.org/wp-content/uploads/2022/12/farmer-field-school-1.jpeg?modtime=',
    }
];


const Campaign = () => {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % campaigns.length);
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + campaigns.length) % campaigns.length);
    };

    const camp = campaigns[current];
    const imagePosition = current % 2 === 0 ? 'right' : 'left';





    return (
        <div className="campaign-container">
            <div className={`campaign-section ${imagePosition}`}>
                <div className="campaign-title">
                    <h2>{camp.title}</h2>
                </div>
                <div className="campaign-body">
                    <div className="campaign-text">
                        <p>{camp.description}</p>
                        <h4>Impact</h4>
                        <p>{camp.impact}</p>
                    </div>
                    <div className="campaign-image">
                        <img src={camp.image} alt={camp.title} />
                    </div>
                </div>
            </div>
            <div className="campaign-controls">
                <button onClick={prevSlide}>&larr; Previous</button>
                <button onClick={nextSlide}>Next &rarr;</button>
            </div>
        </div>
    );
};

export default Campaign;






