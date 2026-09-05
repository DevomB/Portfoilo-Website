"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, type ComponentProps } from "react";

/**
 * A link that prefetches on intent — pointer enter, keyboard focus, or touch —
 * instead of on viewport entry.
 *
 * Next's default prefetches every internal link the moment it scrolls into
 * view, which is right for the primary paths (project rows) and wrong for
 * everything else: the footer's legal pages, or a heavy demo route, would be
 * fetched for every visitor who merely scrolled past. In the App Router,
 * `prefetch={false}` turns off hover prefetch too, so intent has to be wired
 * by hand: the route is warmed once, the first time the user shows interest,
 * which still lands ~100-300ms ahead of the click.
 */
type Props = Omit<ComponentProps<typeof Link>, "href" | "prefetch"> & { href: string };

export default function IntentLink({ href, onPointerEnter, onFocus, onTouchStart, ...rest }: Props) {
  const router = useRouter();
  const warmed = useRef(false);

  const warm = useCallback(() => {
    if (warmed.current) return;
    warmed.current = true;
    router.prefetch(href);
  }, [href, router]);

  return (
    <Link
      href={href}
      prefetch={false}
      onPointerEnter={(e) => { warm(); onPointerEnter?.(e); }}
      onFocus={(e) => { warm(); onFocus?.(e); }}
      onTouchStart={(e) => { warm(); onTouchStart?.(e); }}
      {...rest}
    />
  );
}
