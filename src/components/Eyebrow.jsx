export default function Eyebrow({ children, className = '', variant = 'light' }) {
  // variant 'light' is for light cream backgrounds (color: #456F5C)
  // variant 'dark' is for dark forest green backgrounds (color: #C6A56A gold)
  const defaultColor = variant === 'dark' ? 'text-[#C6A56A]' : 'text-[#456F5C]';

  return (
    <p
      className={`text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold font-body select-none ${defaultColor} ${className}`}
    >
      {children}
    </p>
  );
}
