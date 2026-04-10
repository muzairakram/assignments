"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/pipeline", label: "Pipeline" },
  { href: "/utilization", label: "Utilization" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] bg-navy flex flex-col z-40">
      <div className="px-6 py-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-text">
          DA Operations
        </div>
        <div className="text-white text-[16px] font-extrabold mt-1 tracking-tight">
          Suite
        </div>
      </div>

      <nav className="flex flex-col mt-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-[13px] font-bold uppercase tracking-[0.1em] transition-colors duration-150 ${
                isActive
                  ? "text-gold bg-white/10 border-l-[3px] border-gold"
                  : "text-white/70 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-6 py-6">
        <div className="text-[10px] text-grey-text">
          Delivery Associates
        </div>
      </div>
    </aside>
  );
}
