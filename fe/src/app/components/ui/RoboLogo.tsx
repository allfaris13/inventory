export function RoboLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 180 180" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full overflow-visible ${className || ''}`}
    >
      <defs>
        <mask id="eye-mask">
          <rect width="180" height="180" fill="white" />
          {/* These punch through anything with this mask */}
          <ellipse cx="60" cy="78" rx="4" ry="8" fill="black" />
          <ellipse cx="85" cy="76" rx="4" ry="8" fill="black" />
        </mask>
      </defs>

      {/* Spiral Antenna on Top */}
      <path 
        d="M95 28C92 25 93 20 97 18C101 16 106 18 107 22C108 26 104 29 101 27C99 26 98 24 100 23" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      
      <g mask="url(#eye-mask)">
        {/* Secondary/Rear 3D side face */}
        <path 
          d="M122 112L138 125L120 45L110 38L122 112Z" 
          fill="currentColor" 
          opacity="0.4"
        />
        
        {/* Main Cube/Lamp Head Face */}
        <path 
          d="M40 115C60 120 100 118 122 112L110 38C85 32 60 35 45 45L40 115Z" 
          fill="currentColor" 
        />

        {/* Bottom underside (Lip of head) */}
        <path 
          d="M40 115L122 112L138 125L125 130L40 115Z" 
          fill="currentColor" 
          opacity="0.6"
        />
      </g>
      
      {/* Right Arm/Fin */}
      <path 
        d="M102 135C102 135 115 132 120 140C125 148 115 155 105 150C102 148 102 140 102 135Z" 
        fill="currentColor" 
      />

      {/* Main Body Base */}
      <path 
        d="M65 120V150C65 162 95 162 95 150V120H65Z" 
        fill="currentColor" 
      />

      {/* Left Arm/Fin */}
      <path 
        d="M65 138L55 155C55 155 60 160 63 158L65 145" 
        fill="currentColor" 
      />
    </svg>
  );
}
