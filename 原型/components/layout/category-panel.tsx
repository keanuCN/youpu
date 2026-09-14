import { Link } from "@tanstack/react-router";
import { CATEGORY_TREE } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { CategoryNode } from "@/types";

/** 顶栏「全部品类」下拉面板：三级品类树，未上线的显示占位 */
export function CategoryPanel({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  const roots = CATEGORY_TREE;
  return (
    <div className={cn("grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {roots.map((root) => (
        <div key={root.slug}>
          <p className="mono-label mb-3 border-b border-foreground pb-2">{root.name}</p>
          <div className="space-y-4">
            {root.children?.map((mid) => (
              <Branch key={mid.slug} node={mid} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Branch({ node, onNavigate }: { node: CategoryNode; onNavigate?: () => void }) {
  return (
    <div>
      <p className="mono-label mb-1.5 text-foreground/70">{node.name}</p>
      <ul className="space-y-1">
        {node.children?.map((leaf) => (
          <li key={leaf.slug}>
            {leaf.status === "live" ? (
              <Link
                to="/browse/$slug"
                params={{ slug: leaf.slug }}
                onClick={onNavigate}
                className="story-link text-[13px] text-foreground hover:text-primary"
              >
                {leaf.name}
                <span className="mono-label ml-1.5">{leaf.nameEn}</span>
              </Link>
            ) : (
              <Link
                to="/soon/$slug"
                params={{ slug: leaf.slug }}
                onClick={onNavigate}
                className="group flex items-baseline gap-1.5 text-[13px] text-muted-foreground hover:text-foreground"
              >
                {leaf.name}
                <span className="mono-label">筹备中</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
