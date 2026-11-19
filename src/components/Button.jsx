// Button — dark, light, and outline variants; renders as <a> when href is set
export default function Button({ children, variant = 'dark', href, onClick, disabled, className = '', type = 'button', ...rest }) {
  const base = 'inline-flex items-center gap-2 px-6 py-3 rounded-sm text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer';
  const variants = {
    dark:    'bg-[var(--forest)] text-[var(--cream)] hover:bg-[var(--deep)] focus-visible:outline-[var(--forest)]',
    light:   'bg-[var(--cream)] text-[var(--forest)] hover:bg-white focus-visible:outline-[var(--cream)]',
    outline: 'border border-current hover:opacity-80 focus-visible:outline-current',
  };
  const cls = `${base} ${variants[variant]} ${className}`;

  if (href && !disabled) {
    return <a href={href} className={cls} {...rest}>{children}</a>;
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${cls} disabled:opacity-50 disabled:cursor-not-allowed`} {...rest}>
      {children}
    </button>
  );
}
