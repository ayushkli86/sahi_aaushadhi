import React from 'react';
import './MedBot.css';

interface MedBotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const MedBot: React.FC<MedBotProps> = ({ 
  size = 'md', 
  animated = true,
  className = '' 
}) => {
  const sizeMap = {
    sm: 80,
    md: 120,
    lg: 160,
    xl: 200
  };

  const dimension = sizeMap[size];

  return (
    <div className={`medbot-container ${animated ? 'medbot-animated' : ''} ${className}`}>
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="medbot-svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="50%" stopColor="#0891b2" stopOpacity="1" />
            <stop offset="100%" stopColor="#0e7490" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="headGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.3" />
          </linearGradient>

          <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#67e8f9" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
          </radialGradient>

          {/* Filters for depth and glow */}
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feComposite in="blur" in2="SourceGraphic" operator="out" result="inverse" />
            <feFlood floodColor="#ffffff" floodOpacity="0.4" result="color" />
            <feComposite in="color" in2="inverse" operator="in" result="shadow" />
            <feComposite in="shadow" in2="SourceGraphic" operator="over" />
          </filter>
        </defs>

        {/* Main Body Shadow */}
        <ellipse
          cx="100"
          cy="180"
          rx="45"
          ry="8"
          fill="#000000"
          opacity="0.15"
          className="medbot-shadow"
        />

        {/* Antenna */}
        <g className="medbot-antenna">
          <line
            x1="100"
            y1="35"
            x2="100"
            y2="20"
            stroke="url(#bodyGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            cx="100"
            cy="16"
            r="5"
            fill="#10b981"
            filter="url(#glow)"
            className="medbot-antenna-light"
          />
        </g>

        {/* Head */}
        <g filter="url(#softShadow)">
          {/* Head main shape */}
          <rect
            x="60"
            y="35"
            width="80"
            height="70"
            rx="20"
            fill="url(#headGradient)"
            className="medbot-head"
          />
          
          {/* Head highlight */}
          <rect
            x="65"
            y="40"
            width="70"
            height="30"
            rx="15"
            fill="url(#glowGradient)"
            opacity="0.3"
          />

          {/* Screen/Face */}
          <rect
            x="70"
            y="50"
            width="60"
            height="45"
            rx="12"
            fill="url(#screenGradient)"
            filter="url(#innerGlow)"
            className="medbot-screen"
          />

          {/* Screen glow overlay */}
          <rect
            x="70"
            y="50"
            width="60"
            height="45"
            rx="12"
            fill="url(#screenGlow)"
            opacity="0.6"
            className="medbot-screen-glow"
          />

          {/* Medical Cross on Screen */}
          <g className="medbot-cross">
            {/* Vertical bar */}
            <rect
              x="97"
              y="62"
              width="6"
              height="20"
              rx="2"
              fill="#ffffff"
              opacity="0.9"
            />
            {/* Horizontal bar */}
            <rect
              x="90"
              y="69"
              width="20"
              height="6"
              rx="2"
              fill="#ffffff"
              opacity="0.9"
            />
          </g>

          {/* AI Interface dots */}
          <g className="medbot-interface-dots">
            <circle cx="85" cy="85" r="2" fill="#ffffff" opacity="0.7" />
            <circle cx="95" cy="85" r="2" fill="#ffffff" opacity="0.7" />
            <circle cx="105" cy="85" r="2" fill="#ffffff" opacity="0.7" />
            <circle cx="115" cy="85" r="2" fill="#ffffff" opacity="0.7" />
          </g>
        </g>

        {/* Body */}
        <g filter="url(#softShadow)">
          {/* Main body */}
          <rect
            x="55"
            y="105"
            width="90"
            height="65"
            rx="25"
            fill="url(#bodyGradient)"
            className="medbot-body"
          />

          {/* Body highlight */}
          <rect
            x="60"
            y="110"
            width="80"
            height="25"
            rx="20"
            fill="url(#glowGradient)"
            opacity="0.25"
          />

          {/* Heart/Health indicator */}
          <g className="medbot-heart">
            <path
              d="M100 130 L95 125 Q92 122 92 118 Q92 115 94 113 Q96 111 98 111 Q99 111 100 112 Q101 111 102 111 Q104 111 106 113 Q108 115 108 118 Q108 122 105 125 Z"
              fill="#10b981"
              opacity="0.8"
              filter="url(#glow)"
              className="medbot-heart-pulse"
            />
          </g>
        </g>

        {/* Arms */}
        <g className="medbot-arms">
          {/* Left arm */}
          <g filter="url(#softShadow)">
            <rect
              x="40"
              y="115"
              width="18"
              height="45"
              rx="9"
              fill="url(#bodyGradient)"
              className="medbot-arm-left"
            />
            <ellipse
              cx="49"
              cy="162"
              rx="10"
              ry="8"
              fill="#0891b2"
            />
          </g>

          {/* Right arm */}
          <g filter="url(#softShadow)">
            <rect
              x="142"
              y="115"
              width="18"
              height="45"
              rx="9"
              fill="url(#bodyGradient)"
              className="medbot-arm-right"
            />
            <ellipse
              cx="151"
              cy="162"
              rx="10"
              ry="8"
              fill="#0891b2"
            />
          </g>
        </g>

        {/* Legs */}
        <g className="medbot-legs">
          {/* Left leg */}
          <g filter="url(#softShadow)">
            <rect
              x="70"
              y="165"
              width="20"
              height="15"
              rx="8"
              fill="url(#bodyGradient)"
            />
          </g>

          {/* Right leg */}
          <g filter="url(#softShadow)">
            <rect
              x="110"
              y="165"
              width="20"
              height="15"
              rx="8"
              fill="url(#bodyGradient)"
            />
          </g>
        </g>

        {/* Reflection/Glass effect overlay */}
        <rect
          x="60"
          y="35"
          width="80"
          height="135"
          rx="20"
          fill="url(#glowGradient)"
          opacity="0.1"
          pointerEvents="none"
        />
      </svg>
    </div>
  );
};

export default MedBot;
