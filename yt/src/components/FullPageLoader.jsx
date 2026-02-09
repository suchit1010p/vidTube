import React from 'react';
import './FullPageLoader.css';

const FullPageLoader = () => {
    return (
        <div className="fpl-overlay">
            <div className="fpl-scene">
                <div className="fpl-ball"></div>
                <div className="fpl-shadow"></div>
            </div>
            <div className="fpl-text">Loading...</div>
        </div>
    );
};

export default FullPageLoader;
