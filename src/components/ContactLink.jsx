// Renders nothing when href is null — no dead links (GAP-02)
export default function ContactLink({ href, children, className = '', ...rest }) {
  if (!href) return null;
  return <a href={href} className={className} {...rest}>{children}</a>;
}
