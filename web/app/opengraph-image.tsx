import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Facebook, LinkedIn, Slack and WhatsApp all read this same og:image.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sargam — Retro Bollywood Melodies";

// Rendered at build time rather than shipped as a static file, so the badge and
// the app's palette stay in step without maintaining a separate artwork file.
export default async function Image() {
  const logo = readFileSync(
    join(process.cwd(), "public", "web-app-manifest-512x512.png")
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 88px",
          background: "linear-gradient(135deg, #090b10 0%, #121520 55%, #07080c 100%)",
        }}
      >
        {/* Warm amber bloom behind the mark, echoing the app's ambient wash. */}
        <div
          style={{
            position: "absolute",
            top: 120,
            left: 40,
            width: 520,
            height: 520,
            borderRadius: 999,
            background: "rgba(245, 158, 11, 0.20)",
            filter: "blur(90px)",
          }}
        />

        <img src={logoSrc} width={300} height={300} style={{ borderRadius: 56, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)" }} />

        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: -3,
              color: "#f8fafc",
              lineHeight: 1,
            }}
          >
            Sargam
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 32,
              color: "#f59e0b",
              fontWeight: 600,
              letterSpacing: 2,
            }}
          >
            GOLDEN ERA HINDI CLASSICS
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 26,
              color: "#94a3b8",
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            Browse and play golden-era Hindi film music.
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 34 }}>
            {["3,900+ songs", "66 stations", "Golden era"].map((chip) => (
              <div
                key={chip}
                style={{
                  fontSize: 22,
                  color: "#fef3c7",
                  border: "1px solid rgba(245,158,11,0.35)",
                  backgroundColor: "rgba(245,158,11,0.08)",
                  borderRadius: 999,
                  padding: "8px 20px",
                }}
              >
                {chip}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
