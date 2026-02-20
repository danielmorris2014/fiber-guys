export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Hide the site shell (Nav, Footer, overlays) when Sanity Studio is active */}
      <style>{`
        nav, footer, #grain-overlay, #custom-cursor, #signal-line-transition, #preloader,
        .smooth-scroll-wrapper > nav,
        .smooth-scroll-wrapper > footer {
          display: none !important;
        }
        .smooth-scroll-wrapper {
          height: 100vh !important;
          overflow: visible !important;
        }
        /* Sanity Studio needs full viewport */
        #sanity-studio {
          position: fixed;
          inset: 0;
          z-index: 9999;
        }
      `}</style>
      <div id="sanity-studio">
        {children}
      </div>
    </>
  );
}
