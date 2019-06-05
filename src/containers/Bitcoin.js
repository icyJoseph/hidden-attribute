import React from "react";
import axios from "axios";
import {
  VictoryChart,
  VictoryScatter,
  VictoryAxis,
  VictoryLabel
} from "victory";

const endpoint =
  "https://api.coindesk.com/v1/bpi/historical/close.json?currency=SEK";

const colors = ["#fff489", "#fa57c1", "#b166cc", "#7572ff", "#69a6f9"];
const symbols = [
  "circle",
  "star",
  "square",
  "triangleUp",
  "triangleDown",
  "diamond",
  "plus"
];

const msDay = 1000 * 60 * 60 * 24;

const tickFormat = t => {
  const today = new Date();
  const tickDate = new Date(t);
  const diff = new Date(today - tickDate).getTime();
  const days = Math.floor(diff / msDay);
  return `${days} ${days > 1 ? "days" : "day"} ago`;
};

export function Bitcoin() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const source = axios.CancelToken.source();
    axios
      .get(endpoint, {
        cancelToken: source.token
      })
      .then(({ data: { bpi } }) => {
        const asEntries = Object.entries(bpi).map(([x, y]) => ({
          x,
          y
        }));
        return setData(asEntries);
      })
      .catch(err => {
        if (axios.isCancel(err)) {
          console.info(err.message);
        }
      });
    return () => source.cancel("Cancel BitCoin fetch");
  }, []);

  const all = React.useMemo(
    () => data.reduce((prev, { y }) => [...prev, y], []),
    [data]
  );

  const yDomain = React.useMemo(
    () =>
      [Math.min(...all) * 0.95, Math.max(...all) * 1.05].map(e =>
        Math.floor(e)
      ),
    [all]
  );

  const [current] = all.slice(-1);

  return (
    <div>
      <h4>
        Bitcoin price the last 31 days, <br /> in 1000 SEK.
      </h4>
      <span>Last: {Math.round(current / 1000)} x 1000 SEK</span>
      <VictoryChart style={{ parent: { height: "auto" } }}>
        <VictoryScatter
          data={data}
          domain={{ y: yDomain }}
          labels={datum => Math.round(datum.y / 1000)}
          symbol={datum => symbols[Math.round(datum.y) % 7]}
          size={7}
          style={{
            labels: {
              fontSize: 6,
              fill: "white",
              lineHeight: 5,
              fontFamily: "Press Start 2P"
            },
            data: {
              fill: datum => colors[Math.round(datum.y) % 5]
            }
          }}
        />
        <VictoryAxis
          tickCount={2}
          tickFormat={tickFormat}
          style={{
            axis: { stroke: "white" },
            tickLabels: {
              fontSize: 9,
              fontFamily: "Press Start 2P",
              fill: "white"
            },
            ticks: {
              size: 5,
              stroke: "white"
            }
          }}
        />
      </VictoryChart>
    </div>
  );
}

export default Bitcoin;
