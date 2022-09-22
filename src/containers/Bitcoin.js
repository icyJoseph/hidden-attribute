import React from "react";
import axios from "axios";
import { VictoryChart, VictoryScatter, VictoryAxis } from "victory";

const endpoint =
  "https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=SEK&limit=31";

const colors = ["#fff489", "#fa57c1", "#b166cc", "#7572ff", "#69a6f9"];
const symbols = [
  "circle",
  "star",
  "square",
  "triangleUp",
  "triangleDown",
  "diamond",
  "plus",
];

const msDay = 1000 * 60 * 60 * 24;

const tickFormat = (t) => {
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
        cancelToken: source.token,
      })
      .then(({ data: { Data } }) => {
        const asEntries = Data.Data.map(({ time, close }) => ({
          x: time * 1000,
          y: close,
        }));

        return setData(asEntries);
      })
      .catch((err) => {
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
      [Math.min(...all) * 0.95, Math.max(...all) * 1.05].map((e) =>
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

      <VictoryChart style={{ parent: { height: "75vh" } }}>
        <VictoryScatter
          data={data}
          domain={{ y: yDomain }}
          labels={({ datum }) => {
            return Math.round(datum.y / 1000);
          }}
          symbol={(datum) => symbols[Math.round(datum.y) % 7]}
          size={7}
          style={{
            labels: {
              fontSize: 6,
              fill: "white",
              lineHeight: 5,
              fontFamily: "Press Start 2P",
            },
            data: {
              fill: (datum) => colors[Math.round(datum.y) % 5],
            },
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
              fill: "white",
            },
            ticks: {
              size: 5,
              stroke: "white",
            },
          }}
        />
      </VictoryChart>
    </div>
  );
}

export default Bitcoin;
