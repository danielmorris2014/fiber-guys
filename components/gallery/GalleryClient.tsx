"use client";

import { useState, useMemo, Suspense } from "react";
import { LayoutGroup } from "motion/react";
import { FilterChips } from "./FilterChips";
import { GalleryGrid } from "./GalleryGrid";
import { GalleryLightbox } from "./GalleryLightbox";
import { GallerySkeleton } from "./GallerySkeleton";
import type { GalleryItem, GalleryCategory } from "@/lib/types";

type FilterOption = "all" | GalleryCategory;

interface GalleryClientProps {
  items: GalleryItem[];
}

export function GalleryClient({ items }: GalleryClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = useMemo(
    () =>
      activeFilter === "all"
        ? items
        : items.filter((item) => item.category === activeFilter),
    [items, activeFilter]
  );

  return (
    <LayoutGroup>
      <div className="space-y-8">
        <FilterChips active={activeFilter} onChange={setActiveFilter} />

        <Suspense fallback={<GallerySkeleton />}>
          <GalleryGrid items={filteredItems} onSelect={setSelectedItem} />
        </Suspense>
      </div>

      <GalleryLightbox
        item={selectedItem}
        items={filteredItems}
        onClose={() => setSelectedItem(null)}
        onNavigate={setSelectedItem}
      />
    </LayoutGroup>
  );
}
