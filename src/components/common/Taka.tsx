import React from 'react';

interface TakaProps {
  className?: string;
  size?: number;
}

/**
 * Robust, cross-platform Bangladeshi Taka (৳) symbol component.
 * Renders an exact vector SVG representation of the official Bangladesh Bank Taka sign (৳)
 * ensuring crisp, zero-tofu rendering even on systems without Bengali fonts installed.
 */
export const Taka: React.FC<TakaProps> = ({ className = 'w-3.5 h-3.5 inline-block text-current', size }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="BDT (৳)"
      role="img"
    >
      <path d="M7.8 4.2C5.7 4.2 4 5.9 4 8c0 1.9 1.4 3.5 3.3 3.8L5.5 14h3.1l1.5-2h4.4v8.5H12v2.5h5.5v-2.5h-1.5V6.7h1.5V4.2H7.8zm3.2 5.3H7.8C6.8 9.5 6 8.7 6 7.7s.8-1.8 1.8-1.8h3.2v3.6z" />
    </svg>
  );
};

export const formatPrice = (amount: number): React.ReactNode => {
  return (
    <span className="inline-flex items-center">
      <Taka className="w-3.5 h-3.5 mr-0.5 inline-block align-middle text-[#D4AF66]" />
      <span>{Number(amount || 0).toLocaleString()}</span>
    </span>
  );
};

/**
 * Replaces any occurrence of the '৳' character in a string with the vector <Taka /> component
 */
export const renderWithTaka = (str: string): React.ReactNode => {
  if (!str || !str.includes('৳')) return str;
  const parts = str.split('৳');
  return parts.map((part, index) => (
    <React.Fragment key={index}>
      {part}
      {index < parts.length - 1 && (
        <Taka className="w-3.5 h-3.5 inline-block align-middle text-[#D4AF66] mx-0.5" />
      )}
    </React.Fragment>
  ));
};
