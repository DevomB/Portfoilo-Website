import Link from "next/link";

type NavLinkProps = {
  href: string;
  title: string;
  onClick?: () => void;
  mobile?: boolean;
};

export default function NavLink({
  href,
  title,
  onClick,
  mobile = false,
}: NavLinkProps) {
  const desktopCls =
    "inline-flex touch-manipulation items-center rounded-full px-4 py-2 text-fluid-sm font-medium text-ink/70 transition hover:bg-surface-elevated hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
  const mobileCls =
    "flex min-h-[2.75rem] w-full touch-manipulation items-center rounded-xl px-4 text-fluid-base font-medium text-ink transition hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

  return (
    <Link
      href={href}
      onClick={onClick}
      scroll
      className={mobile ? mobileCls : desktopCls}
    >
      {title}
    </Link>
  );
}
