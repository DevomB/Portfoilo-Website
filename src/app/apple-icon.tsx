import { ImageResponse } from "next/og";
import { FanMark } from "@/brand/mark";

/* iOS home-screen icon. Apple masks its own corners, so this is a full-bleed
   square; the mark sits on the site's raised-surface colour so it reads as an
   object rather than a screenshot of a black page. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 40%, #1a1030 0%, #0b0810 70%, #000000 100%)",
        }}
      >
        <FanMark size={140} />
      </div>
    ),
    size,
  );
}
