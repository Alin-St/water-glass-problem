import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Card, Select, Typography } from "antd";
import { useState, type CSSProperties, type HTMLAttributes } from "react";
import cedeazaTrecerea from "./assets/prioritati/cedeaza-trecerea.png";
import drumCuPrioritate from "./assets/prioritati/drum-cu-prioritate.png";
import intersectie from "./assets/prioritati/intersectie.jpg";
import masina from "./assets/prioritati/masina.png";
import oprire from "./assets/prioritati/oprire.png";
import panouAditional1 from "./assets/prioritati/panou-aditional-1.png";
import panouAditional2 from "./assets/prioritati/panou-aditional-2.png";
import panouAditional3 from "./assets/prioritati/panou-aditional-3.png";
import panouAditional4 from "./assets/prioritati/panou-aditional-4.png";
import _ from "lodash";

type Blinker = "none" | "left" | "right";
type Sign1 = "stop" | "ct" | "dp";
type Sign2 = "none" | "left" | "right";

type GeneratorSettings = {
  cars: number;
};

type CarProps = {
  blinker: Blinker;
} & HTMLAttributes<HTMLDivElement>;

const Car = ({ blinker = "none", ...props }: CarProps) => (
  <div {...props} style={{ aspectRatio: "377 / 855", ...props?.style }}>
    <img
      src={masina}
      alt="masina"
      style={{ height: "100%", width: "100%", objectFit: "contain" }}
    />
    {blinker !== "none" && (
      <>
        <style>{`@keyframes blinkerOnOff { 0%, 50% { opacity: 1; } 50%, 100% { opacity: 0; } }`}</style>
        <div
          style={{
            position: "absolute",
            left: blinker === "right" ? "15%" : "85%",
            top: "87%",
            width: 1,
            height: 1,
            borderRadius: "50%",
            backgroundColor: "#ff9f1a",
            boxShadow: "0 0 12px 10px rgba(255,159,26,0.9)",
            animation: "blinkerOnOff 0.7s steps(1) infinite",
          }}
        />
      </>
    )}
  </div>
);

type IntersectionProps = {
  sign1: Sign1;
  sign2: Sign2;
  botBlinker: Blinker;
  leftBlinker?: Blinker;
  topBlinker?: Blinker;
  rightBlinker?: Blinker;
};

const Intersection = ({
  sign1,
  sign2,
  botBlinker,
  leftBlinker,
  topBlinker,
  rightBlinker,
}: IntersectionProps) => {
  const imgSign1 =
    sign1 === "stop"
      ? oprire
      : sign1 === "ct"
        ? cedeazaTrecerea
        : drumCuPrioritate;

  const imgSign2 =
    sign2 === "none"
      ? undefined
      : sign2 === "left"
        ? sign1 === "dp"
          ? panouAditional3
          : panouAditional1
        : sign1 === "dp"
          ? panouAditional4
          : panouAditional2;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 800,
        aspectRatio: "800 / 600",
        border: "1px solid black",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={intersectie}
        alt="intersectie"
        style={{
          width: "100%",
          height: "100%",
          // objectFit: "cover",
          display: "block",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "66.75%",
          top: "67.33%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <img
          src={imgSign1}
          alt={`img-${sign1}`}
          style={{ height: "10vw", maxHeight: 60, minHeight: 32 }}
        />
        {imgSign2 && (
          <img
            src={imgSign2}
            alt={`img-${sign1}-${sign2}`}
            style={{ height: "7.5vw", maxHeight: 45, minHeight: 24 }}
          />
        )}
      </div>

      <Car
        blinker={botBlinker}
        style={{
          height: "30%",
          position: "absolute",
          left: "52%",
          top: "67%",
          transform: "rotate(180deg)",
        }}
      />

      {topBlinker && (
        <Car
          blinker={topBlinker}
          style={{
            height: "21.67%",
            position: "absolute",
            left: "42%",
            top: "14%",
          }}
        />
      )}

      {leftBlinker && (
        <Car
          blinker={leftBlinker}
          style={{
            height: "25%",
            position: "absolute",
            left: "22%",
            top: "43%",
            transform: "rotate(270deg)",
          }}
        />
      )}

      {rightBlinker && (
        <Car
          blinker={rightBlinker}
          style={{
            height: "25%",
            position: "absolute",
            left: "70%",
            top: "30%",
            transform: "rotate(90deg)",
          }}
        />
      )}
    </div>
  );
};

type IntersectionEditorProps = {
  value: IntersectionProps;
  onChange: (newValue: IntersectionProps) => void;
  style?: CSSProperties;
};

const IntersectionEditor = ({
  value,
  onChange,
  style,
}: IntersectionEditorProps) => {
  const { sign1, sign2, botBlinker, leftBlinker, topBlinker, rightBlinker } =
    value;

  return (
    <Card size="small" title="Editor intersecție" style={style}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(120px, auto) minmax(0, 1fr)",
          gap: 8,
          alignItems: "center",
          alignContent: "start",
        }}
      >
        <Typography>Indicator prioritate:</Typography>
        <Select
          value={sign1}
          style={{ width: "100%" }}
          onChange={(v) => {
            onChange({ ...value, sign1: v as Sign1 });
          }}
          options={[
            { value: "stop", label: "Oprire" },
            { value: "ct", label: "Cedează trecerea" },
            { value: "dp", label: "Drum cu prioritate" },
          ]}
        />
        <Typography>Panou adițional:</Typography>
        <Select
          value={sign2}
          style={{ width: "100%" }}
          onChange={(v) => {
            onChange({ ...value, sign2: v as Sign2 });
          }}
          options={[
            { value: "none", label: "Fără" },
            { value: "left", label: "Spre stânga" },
            { value: "right", label: "Spre dreapta" },
          ]}
        />
        <Typography>Mașina șofer:</Typography>
        <Select
          value={botBlinker}
          style={{ width: "100%" }}
          onChange={(v) => {
            onChange({ ...value, botBlinker: v as Blinker });
          }}
          options={[
            { value: "none", label: "Merge înainte" },
            { value: "left", label: "Virează stânga" },
            { value: "right", label: "Virează dreapta" },
          ]}
        />
        <Typography>Mașina stânga:</Typography>
        <Select
          value={leftBlinker ?? "undefined"}
          style={{ width: "100%" }}
          onChange={(v) => {
            onChange({
              ...value,
              leftBlinker: v === "undefined" ? undefined : (v as Blinker),
            });
          }}
          options={[
            { value: "undefined", label: "Lipsă" },
            { value: "none", label: "Merge înainte" },
            { value: "left", label: "Virează stânga" },
            { value: "right", label: "Virează dreapta" },
          ]}
        />
        <Typography>Mașina față:</Typography>
        <Select
          value={topBlinker ?? "undefined"}
          style={{ width: "100%" }}
          onChange={(v) => {
            onChange({
              ...value,
              topBlinker: v === "undefined" ? undefined : (v as Blinker),
            });
          }}
          options={[
            { value: "undefined", label: "Lipsă" },
            { value: "none", label: "Merge înainte" },
            { value: "left", label: "Virează stânga" },
            { value: "right", label: "Virează dreapta" },
          ]}
        />
        <Typography>Mașina dreapta:</Typography>
        <Select
          value={rightBlinker ?? "undefined"}
          style={{ width: "100%" }}
          onChange={(v) => {
            onChange({
              ...value,
              rightBlinker: v === "undefined" ? undefined : (v as Blinker),
            });
          }}
          options={[
            { value: "undefined", label: "Lipsă" },
            { value: "none", label: "Merge înainte" },
            { value: "left", label: "Virează stânga" },
            { value: "right", label: "Virează dreapta" },
          ]}
        />
      </div>
    </Card>
  );
};

type GeneratorEditorProps = {
  value: GeneratorSettings;
  onChange: (newValue: GeneratorSettings) => void;
  style?: CSSProperties;
};

const GeneratorEditor = ({ value, onChange, style }: GeneratorEditorProps) => {
  const { cars } = value;

  return (
    <Card size="small" title="Setări generator" style={style}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(120px, auto) minmax(0, 1fr)",
          gap: 8,
          alignItems: "center",
          alignContent: "start",
        }}
      >
        <Typography>Număr mașini:</Typography>
        <Select
          value={`${cars}`}
          style={{ width: "100%" }}
          onChange={(v) => {
            onChange({ ...value, cars: Number.parseInt(v) });
          }}
          options={[
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
          ]}
        />
      </div>
    </Card>
  );
};

const generateIntersection = ({
  cars,
}: GeneratorSettings): IntersectionProps => {
  let blinkers: (Blinker | undefined)[] = _.times(cars, () =>
    _.sample(["none", "left", "right"]),
  );
  while (blinkers.length < 3) blinkers.push(undefined);
  blinkers = _.shuffle(blinkers);

  return {
    sign1: _.sample(["stop", "ct", "dp", "dp"]),
    sign2: _.sample(["none", "left", "right"]),
    botBlinker: _.sample(["none", "left", "right"]),
    leftBlinker: blinkers[0],
    topBlinker: blinkers[1],
    rightBlinker: blinkers[2],
  };
};

const solveIntersection = (
  intersectionProps: IntersectionProps,
): { answer: "go" | "stop"; explanation: string } => {
  const { sign1, sign2, botBlinker, leftBlinker, topBlinker, rightBlinker } =
    intersectionProps;
  const explanations = [];
  let stop: boolean = false;

  if (leftBlinker) {
    if (sign1 === "dp" || sign2 === "right")
      explanations.push("Mașina din stânga nu are prioritate.");
    else {
      const msg = "Mașina din stânga are prioritate.";
      if (
        leftBlinker === "right" ||
        (leftBlinker === "left" && botBlinker === "right")
      )
        explanations.push(
          msg +
            " Traiectoriile nu se intersectează. Pot porni cu atenție, dacă am loc.",
        );
      else {
        explanations.push(
          msg + " Traiectoriile se interesectează. Trebuie să opresc.",
        );
        stop = true;
      }
    }
  }

  if (topBlinker) {
    if (sign2 === "none" && botBlinker === "left" && topBlinker === "left")
      explanations.push(
        "Mașina din față are același nivel de prioritate ca mine. Efectuăm virajul pe lângă centrul imaginar al intersecției.",
      );
    else if (
      (sign2 === "none" && botBlinker !== "left") ||
      (sign2 !== "none" && sign1 === "dp")
    )
      explanations.push("Mașina din față nu are prioritate.");
    else {
      const msg = "Mașina din față are prioritate.";
      if ((botBlinker === "left") === (topBlinker === "left"))
        explanations.push(
          msg +
            " Traiectoriile nu se intersectează. Pot porni cu atenție, dacă am loc.",
        );
      else {
        explanations.push(
          msg + " Traiectoriile se intersectează. Trebuie să opresc.",
        );
        stop = true;
      }
    }
  }

  if (rightBlinker) {
    if (sign1 === "dp" && sign2 !== "right")
      explanations.push("Mașina din dreapta nu are prioritate.");
    else {
      const msg = "Mașina din dreapta are prioritate.";
      if (
        botBlinker === "right" ||
        (botBlinker === "left" && rightBlinker === "right")
      )
        explanations.push(
          msg +
            " Traiectoriile nu se intersectează. Pot porni cu atenție, dacă am loc.",
        );
      else {
        explanations.push(
          msg + " Traiectoriile se interesectează. Trebuie să opresc.",
        );
        stop = true;
      }
    }
  }

  return { answer: stop ? "stop" : "go", explanation: explanations.join("\n") };
};

export default function Prioritati() {
  const [intersectionProps, setIntersectionProps] = useState<IntersectionProps>(
    { sign1: "stop", sign2: "none", botBlinker: "left", topBlinker: "left" },
  );
  const [generatorSettings, setGeneratorSettings] = useState<GeneratorSettings>(
    { cars: 1 },
  );
  const [answer, setAnswer] = useState<"go" | "stop">();

  const { sign1, sign2, botBlinker, leftBlinker, topBlinker, rightBlinker } =
    intersectionProps;

  const { answer: correctAnswer, explanation } =
    solveIntersection(intersectionProps);

  const updateIntersectionProps = (newProps: IntersectionProps) => {
    if (!_.isEqual(newProps, intersectionProps)) setAnswer(undefined);
    setIntersectionProps(newProps);
  };

  const handleNext = () => {
    updateIntersectionProps(generateIntersection(generatorSettings));
  };

  return (
    <div style={{ minHeight: "100%", width: "100%", padding: 16 }}>
      <style>{`
      .prioritati-layout {
        display: flex;
        gap: 24px;
        align-items: flex-start;
      }

      .prioritati-side {
        width: 320px;
        flex-shrink: 0;
      }

      .prioritati-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 800px;
        gap: 12px;
        margin-top: 12px;
      }

      .prioritati-answer-buttons {
        display: flex;
        flex: 1;
        justify-content: space-evenly;
        gap: 12px;
      }

      .prioritati-answer-buttons button {
        width: 300px;
      }

      @media (max-width: 900px) {
        .prioritati-layout {
          flex-direction: column;
        }

        .prioritati-side {
          width: 100%;
        }

        .prioritati-actions {
          max-width: 100%;
        }
      }

      @media (max-width: 520px) {
        .prioritati-answer-buttons {
          flex-direction: column;
        }

        .prioritati-answer-buttons button {
          width: 100%;
        }
      }
    `}</style>

      <div className="prioritati-layout">
        <Intersection
          sign1={sign1}
          sign2={sign2}
          botBlinker={botBlinker}
          leftBlinker={leftBlinker}
          topBlinker={topBlinker}
          rightBlinker={rightBlinker}
        />

        <div className="prioritati-side">
          <IntersectionEditor
            value={intersectionProps}
            onChange={updateIntersectionProps}
          />
          <GeneratorEditor
            value={generatorSettings}
            onChange={setGeneratorSettings}
            style={{ marginTop: 24 }}
          />
        </div>
      </div>

      <div className="prioritati-actions">
        <div className="prioritati-answer-buttons">
          <Button
            disabled={!!answer}
            type="primary"
            onClick={() => setAnswer("go")}
          >
            GO!
          </Button>
          <Button
            disabled={!!answer}
            type="primary"
            danger
            onClick={() => setAnswer("stop")}
          >
            STOP
          </Button>
        </div>

        <Button shape="circle" size="large" onClick={handleNext}>
          <ArrowRightOutlined />
        </Button>
      </div>

      {answer && (
        <Typography style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
          {answer === correctAnswer
            ? "✅ Răspuns corect. "
            : "❌ Răspuns greșit. "}
          {correctAnswer === "go"
            ? "Se poate continua deplasarea."
            : "Trebuie dat prioritate."}{" "}
          <br />
          {explanation}
        </Typography>
      )}
    </div>
  );
}
