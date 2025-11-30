import { Button, Slider, Typography } from "antd";
import { useState } from "react";

type Vec2 = { x: number; y: number };

const WIDTH_PX = 800;

function TriangleDrawing({
  layers,
  spacing,
  scale,
}: {
  layers: number;
  spacing: number;
  scale: number;
}) {
  const circles: number[] = [...Array(layers + 1)].map((_, i) => {
    if (i === 0) return 0;

    const count = 6 * Math.pow(4, i - 1);
    const alpha = (2 * Math.PI) / count;
    const r1 = i;
    const r2 =
      1 /
      Math.sqrt(
        Math.pow(1 - Math.cos(alpha), 2) + Math.pow(Math.sin(alpha), 2)
      );
    const r = r1 * (1 - spacing) + r2 * spacing;
    return r;
  });

  const points: Vec2[][] = [...Array(layers + 1)].map((_, i) => {
    if (i === 0) return [{ x: 0, y: 0 }];

    const count = 6 * Math.pow(4, i - 1);
    const r = circles[i];

    return [...Array(count)].map((_, j) => {
      const angle = (Math.PI * (2 * j + 1)) / count;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      return { x, y };
    });
  });

  const triangles: Vec2[][][] = [...Array(layers)].map((_, i) => {
    if (i === 0) {
      return [
        [points[0][0], points[1][0], points[1][1]],
        [points[0][0], points[1][2], points[1][3]],
        [points[0][0], points[1][4], points[1][5]],
      ];
    }

    return points[i].flatMap((p, j) => [
      [p, points[i + 1][j * 4], points[i + 1][j * 4 + 1]],
      [p, points[i + 1][j * 4 + 2], points[i + 1][j * 4 + 3]],
    ]);
  });

  return (
    <svg
      width={WIDTH_PX}
      height={WIDTH_PX}
      viewBox={`${-WIDTH_PX / 2} ${-WIDTH_PX / 2} ${WIDTH_PX} ${WIDTH_PX}`}
      style={{ display: "block", border: "1px solid black" }}
    >
      {circles.map((c, i) => (
        <circle
          key={`circle-${i}`}
          r={scale * c}
          cx={0}
          cy={0}
          stroke="red"
          strokeWidth={1}
          strokeDasharray={5}
          fill="none"
        />
      ))}
      {points.map((l, i) =>
        l.map((p, j) => (
          <circle
            key={`point-${i}-${j}`}
            r={2}
            cx={p.x * scale}
            cy={-p.y * scale}
            fill="black"
          />
        ))
      )}
      {triangles.map((l, i) =>
        l.map((t, j) => (
          <polygon
            key={`triangle-${i}-${j}`}
            points={t.map((p) => `${p.x * scale},${-p.y * scale}`).join(" ")}
            fill="rgba(0,0,0,0.2)"
            stroke="black"
          />
        ))
      )}
    </svg>
  );
}

export default function TriangleProblem() {
  const [layers, setLayers] = useState(5);
  const [spacing, setSpacing] = useState(0);
  const [scale, setScale] = useState(100);

  const resetValues = () => {
    setLayers(5);
    setSpacing(0);
    setScale(100);
  };

  return (
    <div style={{ height: "100%", width: "100%", padding: 32 }}>
      <div
        style={{
          display: "flex",
          gap: 12,
        }}
      >
        <TriangleDrawing
          layers={layers}
          spacing={spacing / 100}
          scale={scale}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            flexBasis: "400px",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Typography>Straturi:</Typography>
            <Slider
              value={layers}
              onChange={setLayers}
              min={1}
              max={10}
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Typography>Spațiu:</Typography>
            <Slider value={spacing} onChange={setSpacing} style={{ flex: 1 }} />
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Typography>Scalare:</Typography>
            <Slider value={scale} onChange={setScale} style={{ flex: 1 }} />
          </div>
          <Button onClick={resetValues}>Resetare</Button>
        </div>
      </div>
    </div>
  );
}
