import { Tabs } from "antd";
import type { TabsProps } from "antd";
import WaterGlass from "./WaterGlass";
import TriangleProblem from "./TriangleProblem";
import Prioritati from "./Prioritati";

export default function App() {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Water Glass Problem",
      children: <WaterGlass />,
    },
    {
      key: "2",
      label: "Triangle Problem",
      children: <TriangleProblem />,
    },
    {
      key: "3",
      label: "Priorități",
      children: <Prioritati />,
    },
  ];

  return (
    <Tabs
      defaultActiveKey="water-glass"
      items={items}
      tabBarStyle={{ paddingLeft: 12 }}
    />
  );
}
