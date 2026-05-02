import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { useMemo, useState } from "react";
import WaterGlass from "./WaterGlass";
import TriangleProblem from "./TriangleProblem";
import Prioritati from "./Prioritati";

const tabs = {
  "water-glass": "Water Glass Problem",
  "triangle-problem": "Triangle Problem",
  prioritati: "Priorități",
} as const;

type TabKey = keyof typeof tabs;

const isTabKey = (value: string): value is TabKey => {
  return value in tabs;
};

const getInitialTab = (): TabKey => {
  const lastPathPart = window.location.pathname
    .split("/")
    .filter(Boolean)
    .at(-1);

  if (lastPathPart && isTabKey(lastPathPart)) {
    return lastPathPart;
  }

  return "water-glass";
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>(getInitialTab);

  const items: TabsProps["items"] = useMemo(
    () => [
      {
        key: "water-glass",
        label: "Water Glass Problem",
        children: <WaterGlass />,
      },
      {
        key: "triangle-problem",
        label: "Triangle Problem",
        children: <TriangleProblem />,
      },
      {
        key: "prioritati",
        label: "Priorități",
        children: <Prioritati />,
      },
    ],
    [],
  );

  const handleTabChange = (key: string) => {
    if (!isTabKey(key)) return;

    setActiveTab(key);

    const basePath = "/water-glass-problem";
    const newPath =
      key === "water-glass" ? `${basePath}/` : `${basePath}/${key}`;

    window.history.pushState(null, "", newPath);
  };

  return (
    <Tabs
      activeKey={activeTab}
      items={items}
      onChange={handleTabChange}
      tabBarStyle={{ paddingLeft: 12 }}
    />
  );
}
