import React from 'react';
import { ButtonVariant, Theme } from '../types';

interface ButtonProps {
  label: React.ReactNode;
  variant: ButtonVariant;
  onClick: () => void;
  className?: string;
  theme: Theme;
}

const Button: React.FC<ButtonProps> = ({ label, variant, onClick, className = '', theme }) => {
  const colors = theme.buttonColors[variant];
  
  // 使用 min-h-0 和 flex 确保在极小高度下也能容纳内容
  const baseClasses =
    'active:scale-[0.96] active:brightness-110 transition-all duration-75 flex items-center justify-center select-none touch-manipulation overflow-hidden min-h-0';
  
  const glassStyle = theme.glassmorphism ? {
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)'
  } : {};

  // 动态字体大小：使用高度感知单位或 clamp 防止溢出
  const buttonStyle: React.CSSProperties = {
    backgroundColor: colors.bg,
    color: className.includes('text-[#') ? undefined : colors.text,
    borderRadius: theme.borderRadius,
    boxShadow: theme.buttonShadow,
    border: theme.buttonBorder,
    fontSize: 'clamp(12px, 4vh, 24px)', // 关键：根据视口高度自动调整字号
    ...glassStyle
  };

  return (
    <button
      className={`${baseClasses} ${className} h-full w-full`}
      style={buttonStyle}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      type="button"
    >
      <div className="relative z-10 flex items-center justify-center w-full h-full p-1 text-center font-bold">
        {label}
      </div>
    </button>
  );
};

export default React.memo(Button);
