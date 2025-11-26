import { Button, Slider, Typography } from "antd";
import { useState } from "react";

// Types
type Vec2 = { x: number; y: number };

// Utils
const addV2 = (v1: Vec2, v2: Vec2): Vec2 => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y,
});

const scaleV2 = (v: Vec2, d: number): Vec2 => ({ x: v.x * d, y: v.y * d });

const distance = (v1: Vec2, v2: Vec2): number => {
  const { x: dx, y: dy } = addV2(v1, scaleV2(v2, -1));
  return Math.sqrt(dx * dx + dy * dy);
};

// Config
const BASE_AREA_CM = 3 * Math.PI;
const CANVAS_SIZE_PX = 300;
const BASE_DIAM_PX = CANVAS_SIZE_PX * (1 / 3);
const GLASS_H_PX = BASE_DIAM_PX * 2.5;
const OFFSET_L: Vec2 = {
  x: (CANVAS_SIZE_PX - BASE_DIAM_PX) / 2,
  y: CANVAS_SIZE_PX,
}; // bottom-centered
const OFFSET_R: Vec2 = { x: CANVAS_SIZE_PX - BASE_DIAM_PX, y: CANVAS_SIZE_PX }; // bottom-right

// Based on config
const baseDiamCm = Math.sqrt(BASE_AREA_CM / Math.PI) * 2;
const scale = BASE_DIAM_PX / baseDiamCm;
const glassL: Vec2[] = [
  { x: 0, y: GLASS_H_PX }, // 0: Top left
  { x: 0, y: 0 }, // 1: Bottom left
  { x: BASE_DIAM_PX, y: 0 }, // 2: Bottom right
  { x: BASE_DIAM_PX, y: GLASS_H_PX }, // 3: Top right
].map((c) => scaleV2(c, 1 / scale));

// Math
const toCanvas = ({ x, y }: Vec2, offset: Vec2): Vec2 => ({
  x: x * scale + offset.x,
  y: -y * scale + offset.y,
});

const rotatePoint = ({ x, y }: Vec2, angleDeg: number): Vec2 => {
  const { x: ox, y: oy } = glassL[1]; // pivot
  const a = ((360 - angleDeg) * Math.PI) / 180; // angle in radians

  const dx = x - ox;
  const dy = y - oy;

  const x2 = ox + dx * Math.cos(a) - dy * Math.sin(a);
  const y2 = oy + dx * Math.sin(a) + dy * Math.cos(a);

  return { x: x2, y: y2 };
};

const getWaterR = (glassR: Vec2[]): Vec2[] => {
  const level = glassR[2].y;

  // Finding the point between corners 0-1 with y=level
  // p = p0 * k + p1 * (1 - k)
  // y = y0 * k + y1 * (1 - k) = level
  // k = (y - y1) / (y0 - y1)
  // x = k * x0 + (1 - k) * x1

  const [x0, y0, x1, y1, y] = [
    glassR[0].x,
    glassR[0].y,
    glassR[1].x,
    glassR[1].y,
    level,
  ];

  const k_ = (y - y1) / (y0 - y1);
  const k = Math.abs(y0 - y1) < 1 / scale ? 1e10 : k_;
  const x = k * x0 + (1 - k) * x1;
  const water = [{ x, y }, glassR[1], glassR[2]];
  return water;
};

const doTheMath = (angle: number) => {
  const glassR = glassL.map((p) => rotatePoint(p, 360 - angle));
  const level = glassR[2].y;
  const waterL: Vec2[] = [
    { x: glassL[0].x, y: level },
    glassL[1],
    glassL[2],
    { x: glassL[3].x, y: level },
  ];
  const waterR = getWaterR(glassR);
  const hLevelR = distance(waterR[0], waterR[1]);

  const volumeL = BASE_AREA_CM * level;
  const volumeR = (BASE_AREA_CM * hLevelR) / 2;

  return { glassR, waterL, waterR, volumeL, volumeR };
};

// Glass drawing component
interface GlassDrawingProps {
  glass: Vec2[];
  water: Vec2[];
  offset: Vec2;
}

function GlassDrawing({ glass, water, offset }: GlassDrawingProps) {
  const canvasToSvg = (cvPoints: Vec2[]) =>
    cvPoints
      .map(({ x, y }) => ({ x: x + 1, y: y + 1 }))
      .map(({ x, y }) => `${x},${y}`)
      .join(" ");
  const toSvg = (points: Vec2[]) =>
    canvasToSvg(points.map((p) => toCanvas(p, offset)));

  const levelPx = toCanvas(water[0], offset).y;
  const levelLinePx = [
    { x: -1, y: levelPx },
    { x: CANVAS_SIZE_PX + 1, y: levelPx },
  ];

  const glassPoly = toSvg(glass);
  const waterPoly = toSvg(water);
  const levelPoly = canvasToSvg(levelLinePx);

  return (
    <svg
      width={CANVAS_SIZE_PX + 4}
      height={CANVAS_SIZE_PX + 4}
      style={{ display: "block", border: "1px solid black" }}
    >
      {/* Water */}
      <polygon points={waterPoly} fill="#99C1FF" />

      {/* Glass outline */}
      <polyline points={glassPoly} stroke="black" fill="none" strokeWidth={2} />

      {/* Dotted level line */}
      <polyline
        points={levelPoly}
        stroke="red"
        fill="none"
        strokeDasharray={6}
      />
    </svg>
  );
}

// Main component
export default function App() {
  const [angle, setAngle] = useState(45);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(90);

  const { glassR, waterL, waterR, volumeL, volumeR } = doTheMath(angle);

  const doBinarySearch = () => {
    const newAngle = (left + right) / 2;
    setAngle(newAngle);
    const { volumeL, volumeR } = doTheMath(newAngle);
    if (volumeL < volumeR) setRight(newAngle);
    else setLeft(newAngle);
  };

  return (
    <>
      <div style={{ height: "100%", width: "100%", padding: 32 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
            width: "max-content",
          }}
        >
          <Typography>
            {" "}
            Visualize the water glass problem described in{" "}
            <a href="https://youtu.be/ZgApIQwWWC8">this</a> video from
            MindYourDecisions.
            <br />
            The glass is a cylinder with base area 3π cm² (9.42).
          </Typography>
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <GlassDrawing glass={glassL} water={waterL} offset={OFFSET_L} />
              <Typography>Volume: {volumeL.toFixed(2)} cm³</Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <GlassDrawing glass={glassR} water={waterR} offset={OFFSET_R} />
              <Typography>
                Volume: {volumeR > 1e10 ? "∞" : volumeR.toFixed(2)} cm³
              </Typography>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Typography>Angle:</Typography>
            <Slider
              value={angle}
              onChange={setAngle}
              max={90}
              style={{ flex: 1 }}
            />
            <Typography>{`${angle.toFixed(2)}°`}</Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button onClick={doBinarySearch}>Binary Search</Button>
            <div style={{ flex: 1 }}>
              <Typography>{`Range: ${left.toFixed(2)}-${right.toFixed(
                2
              )}°`}</Typography>
              <Slider
                range
                value={[left, right]}
                onChange={([newLeft, newRight]) => {
                  setLeft(newLeft);
                  setRight(newRight);
                }}
                max={90}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
