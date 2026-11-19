export default function SectionHeading({ children, className = '', as: Tag = 'h2' }) {
  return (
    <Tag
      className={`font-heading font-light tracking-[-0.04em] leading-[1.02] sm:leading-[1.05] text-[clamp(36px,4.5vw,58px)] ${className}`}
    >
      {children}
    </Tag>
  );
}
