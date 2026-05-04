import NavLink from "./NavLink";

export default function MenuOverlay({ links, onNavigate }) {
  return (
    <nav aria-label="Mobile navigation" className="px-[var(--shell-inline)] pb-6 pt-4">
      <ul className="flex flex-col gap-1">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              href={link.path}
              title={link.title}
              mobile
              onClick={() => onNavigate?.()}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
