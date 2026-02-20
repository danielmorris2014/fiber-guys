"use client";

import Image from "next/image";
import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";
import type { GalleryItem } from "@/lib/types";

interface GalleryGridProps {
  items: GalleryItem[];
  onSelect: (item: GalleryItem) => void;
}

export function GalleryGrid({ items, onSelect }: GalleryGridProps) {
  const photos = items.map((item) => ({
    src: item.src,
    width: 800,
    height: 600,
    alt: item.title,
    key: item.id,
    title: item.title,
  }));

  return (
    <MasonryPhotoAlbum
      photos={photos}
      columns={(containerWidth) => {
        if (containerWidth < 640) return 1;
        if (containerWidth < 1024) return 2;
        return 3;
      }}
      spacing={16}
      render={{
        photo: (_props, { photo, index, width, height }) => {
          const item = items[index];
          if (!item) return <div />;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="group relative block w-full bg-bg-2 focus-visible:ring-1 focus-visible:ring-orange outline-none cursor-none overflow-hidden"
              aria-label={`View ${item.title}`}
              data-cursor="View"
            >
              <Image
                src={item.src}
                alt={item.altText || `${item.title} — ${item.description}`}
                width={width}
                height={height}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover w-full h-full transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
              />

              {/* Technical Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-orange" />
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-orange" />
                <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-orange" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-orange" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-orange/50" />
                  <div className="absolute left-1/2 top-0 h-full w-[1px] bg-orange/50" />
                </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-bg/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="font-mono text-[10px] text-orange uppercase tracking-wider">{item.category}</p>
                <h3 className="text-sm font-medium text-text">{item.title}</h3>
              </div>
            </button>
          );
        },
      }}
    />
  );
}
