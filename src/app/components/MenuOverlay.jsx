import NavLink from "./NavLink";

export default function MenuOverlay({ links, onNavigate }) {
  return (
    <ul className="flex flex-col items-center gap-1 py-4">
      {links.map((link) => (
        <li key={link.path}>
          <NavLink
            href={link.path}
            title={link.title}
            onClick={() => onNavigate?.()}
          />
        </li>
      ))}
    </ul>
  );
}
