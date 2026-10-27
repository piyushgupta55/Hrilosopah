import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
  strokeWidth?: number | string;
}

/**
 * Authentic Official Bitcoin (₿) Logo Vector
 * Features the canonical 14° clockwise tilt, proportional double-loop bowls,
 * dual top/bottom vertical stubs, and exact serifs per Bitcoin Foundation specification.
 */
export const RealBitcoinIcon: React.FC<IconProps> = ({
  className = 'w-8 h-8 text-white',
  size,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bitcoin"
      {...props}
    >
      <path d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.53-.793.408.017.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.701 2.812 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.537c-.535 2.146-4.152.986-5.325.693l.95-3.81c1.173.293 4.927.872 4.375 3.117zm.536-5.568c-.488 1.954-3.498.962-4.475.718l.861-3.45c.977.243 4.118.7 3.614 2.732z" />
    </svg>
  );
};

/**
 * Authentic Clean Brain SVG Vector
 * Crisp, clean anatomical dual-hemisphere vector matching the design illustration,
 * with graceful gyri contours, smooth central fissure, and zero overlapping strokes.
 */
export const RealBrainIcon: React.FC<IconProps> = ({
  className = 'w-8 h-8 text-white',
  size,
  strokeWidth = 2,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Brain"
      {...props}
    >
      <path d="M12 18V5" />
      <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" />
      <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
      <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
      <path d="M18 18a4 4 0 0 0 2-7.464" />
      <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
      <path d="M6 18a4 4 0 0 1-2-7.464" />
      <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
    </svg>
  );
};
