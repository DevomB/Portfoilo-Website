import Link from "next/link";

export default function NavLink({ href, title, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      scroll
      className="block rounded-md py-2 text-muted transition hover:text-accent-blue md:inline md:p-0"
    >
      {title}
    </Link>
  );
}
