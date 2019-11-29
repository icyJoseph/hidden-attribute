import React from "react";
import { ResponsiveBar } from "@nivo/bar";

export const Charts = ({ data }) => {
  const [{ label: omit, ...rest }] = data;
  const keys = Object.keys(rest);

  const [, , other, , script] = keys;

  return (
    <div style={{ height: "70vh", width: "70vw" }}>
      <ResponsiveBar
        isInteractive={false}
        data={data}
        keys={keys}
        indexBy="label"
        margin={{ top: 50, right: 150, bottom: 50, left: 70 }}
        padding={0.3}
        colors={{ scheme: "nivo" }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#38bcb2",
            size: 4,
            padding: 1,
            stagger: true
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#eed312",
            rotation: -45,
            lineWidth: 6,
            spacing: 10
          }
        ]}
        fill={[
          {
            match: {
              id: script
            },
            id: "dots"
          },
          {
            match: {
              id: other
            },
            id: "lines"
          }
        ]}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["brighter", 2.6]] }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 120,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            itemTextColor: "#ffffff",
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
        theme={{
          labels: {
            text: {
              fontSize: "11pt"
            }
          },
          axis: {
            ticks: {
              text: {
                fill: "#FFFFFF",
                fontSize: "11pt"
              }
            }
          },
          legend: {
            text: {
              fill: "#FFFFFF"
            }
          }
        }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};

export default Charts;
