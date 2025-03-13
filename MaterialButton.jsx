import React from 'react';
import { motion } from 'framer-motion';

/**
 * MaterialButton - A customizable button component following Material You design principles
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant: 'filled', 'tonal', 'outlined', 'text'
 * @param {string} props.size - Button size: 'small', 'medium', 'large'
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {React.ReactNode} props.label - Button text content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {React.ReactNode} props.icon - Icon to display before text
 * @param {React.ReactNode} props.endIcon - Icon to display after text
 */
const MaterialButton = ({ 
  variant = 'filled', 
  size = 'medium', 
  fullWidth = false,
  label,
  children, 
  className = '',
  onClick,
  disabled = false,
  icon,
  endIcon,
  ...props
}) => {
  // Base styles for modern Material You design
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 relative overflow-hidden';
  
  // Size styles with proper rounded corners
  const sizeStyles = {
    small: 'text-sm py-1.5 px-3 gap-1.5 rounded-full',
    medium: 'text-base py-2 px-4 gap-2 rounded-full',
    large: 'text-lg py-2.5 px-6 gap-2.5 rounded-full'
  };
  
  // Variant styles using modern color palette with better dark mode support
  const variantStyles = {
    filled: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm hover:shadow',
    tonal: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50',
    outlined: 'border border-slate-300 dark:border-slate-600 text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/50',
    text: 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-transparent'
  };
  
  // Disabled styles
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';

  // Ripple effect for Material You design
  const handleRipple = (e) => {
    if (disabled) return;
    
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${widthStyles} ${className} ripple-container`}
      onClick={handleRipple}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span className="relative z-10">{label || children}</span>
      {endIcon && <span className="flex items-center">{endIcon}</span>}
      <style dangerouslySetInnerHTML={{ __html: `
        .ripple-container {
          position: relative;
          overflow: hidden;
        }
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.4);
          width: 100px;
          height: 100px;
          margin-top: -50px;
          margin-left: -50px;
          animation: ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform: scale(0);
          pointer-events: none;
          z-index: 0;
        }

        @keyframes ripple {
          to {
            transform: scale(3);
            opacity: 0;
          }
        }

        /* Dark mode adjustments for ripple */
        @media (prefers-color-scheme: dark) {
          .ripple-effect {
            background-color: rgba(255, 255, 255, 0.2);
          }
        }
      `}} />
    </motion.button>
  );
};

export default MaterialButton;
