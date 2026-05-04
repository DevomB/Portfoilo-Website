import Link from "next/link";

export default function NavLink({ href, title, onClick, mobile = false }) {
  const desktopCls =
    "inline-flex touch-manipulation items-center rounded-lg px-3 py-2 text-fluid-sm font-medium text-muted transition hover:bg-surface-elevated hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
  const mobileCls =
    "flex min-h-[2.75rem] w-full touch-manipulation items-center rounded-lg px-4 text-fluid-base font-medium text-white transition hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

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
