"use client";

import dynamic from "next/dynamic";

const StudioComponent = dynamic(
  () =>
    import("next-sanity/studio").then((mod) => {
      const { NextStudio } = mod;
      // eslint-disable-next-line react/display-name
      return function Studio() {
        // Dynamic import sanity config only when rendering
        const config = require("@/sanity.config").default;
        return <NextStudio config={config} />;
      };
    }),
  { ssr: false }
);

export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h1 className="text-white text-xl font-bold mb-4">
            Sanity Studio Not Configured
          </h1>
          <p className="text-white/50 text-sm font-mono">
            Set <code className="text-blue-400">NEXT_PUBLIC_SANITY_PROJECT_ID</code> in your{" "}
            <code className="text-blue-400">.env.local</code> to enable the CMS.
          </p>
        </div>
      </div>
    );
  }

  return <StudioComponent />;
}
