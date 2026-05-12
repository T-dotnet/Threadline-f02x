import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  color?: string;
}

export function Logo({ 
  className = "", 
  size = 32, 
  showText = true,
  color = "#06302c" 
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-110"
      >
        <circle cx="50" cy="50" r="48" fill={color} />
        <path 
          d="M25 55C25 55 35 30 50 50C65 70 75 45 75 45" 
          stroke="white" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
      {showText && (
        <span 
          className="font-sans font-medium tracking-tight text-2xl m-0 select-none" 
          style={{ color: color, fontSize: size * 0.75 }}
        >
          Threadline
        </span>
      )}
    </div>
  );
}
