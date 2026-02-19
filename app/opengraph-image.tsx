import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Fiber Guys | Nationwide Fiber Jetting & Splicing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#050505",
          padding: "60px 80px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundSize: "60px 60px",
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          }}
        />

        {/* Blue accent line at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #2563EB, #60A5FA, #2563EB)",
          }}
        />

        {/* Corner brackets */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            width: "40px",
            height: "40px",
            borderTop: "3px solid #2563EB",
            borderLeft: "3px solid #2563EB",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            width: "40px",
            height: "40px",
            borderBottom: "3px solid #2563EB",
            borderRight: "3px solid #2563EB",
          }}
        />

        {/* Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#2563EB",
              borderRadius: "2px",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "#2563EB",
            }}
          >
            Fiber Construction
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <span
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              textTransform: "uppercase" as const,
            }}
          >
            FIBER GUYS
          </span>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: "transparent",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              textTransform: "uppercase" as const,
              WebkitTextStroke: "2px #2563EB",
            }}
          >
            LLC
          </span>
        </div>

        {/* Separator */}
        <div
          style={{
            width: "100%",
            height: "2px",
            backgroundColor: "#2563EB",
            marginTop: "32px",
            marginBottom: "24px",
            boxShadow: "0 0 20px rgba(37, 99, 235, 0.6)",
          }}
        />

        {/* Subtitle */}
        <span
          style={{
            fontSize: "20px",
            color: "rgba(255, 255, 255, 0.5)",
            fontWeight: 400,
            letterSpacing: "0.04em",
          }}
        >
          Nationwide Fiber Jetting & Splicing Crews
        </span>

        {/* Stats bar at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "80px",
            right: "80px",
            display: "flex",
            gap: "48px",
          }}
        >
          {[
            { value: "12–864ct", label: "Fiber Counts" },
            { value: "25K ft/day", label: "Per Crew" },
            { value: "≤0.03dB", label: "Splice Loss" },
            { value: "50 States", label: "Coverage" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                borderLeft: "2px solid rgba(37, 99, 235, 0.3)",
                paddingLeft: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255, 255, 255, 0.3)",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
