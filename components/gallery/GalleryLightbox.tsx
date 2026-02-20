"use client";

import YARLightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import type { GalleryItem } from "@/lib/types";

interface GalleryLightboxProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onNavigate: (item: GalleryItem) => void;
}

export function GalleryLightbox({ item, items, onClose, onNavigate }: GalleryLightboxProps) {
  const currentIndex = item ? items.findIndex((i) => i.id === item.id) : -1;

  const slides = items.map((i) => ({
    src: i.src,
    alt: i.altText || i.title,
    title: i.title,
    description: `${i.category.toUpperCase()} // ${i.location}${i.description ? ` — ${i.description}` : ""}`,
  }));

  return (
    <YARLightbox
      open={!!item}
      close={onClose}
      index={currentIndex}
      slides={slides}
      plugins={[Zoom, Captions, Thumbnails]}
      on={{
        view: ({ index }) => {
          if (items[index]) onNavigate(items[index]);
        },
      }}
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true,
      }}
      thumbnails={{
        width: 80,
        height: 60,
        border: 0,
        borderRadius: 0,
        gap: 8,
      }}
      captions={{
        descriptionTextAlign: "start",
      }}
      styles={{
        root: {
          "--yarl__color_backdrop": "rgba(11, 13, 16, 0.95)",
        } as Record<string, string>,
        container: {
          backgroundColor: "transparent",
        },
      }}
      animation={{ swipe: 300 }}
      carousel={{ finite: false }}
    />
  );
}
