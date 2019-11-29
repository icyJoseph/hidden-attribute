import React from "react";
import axios from "axios";
import {
  Scatter,
  XAxis,
  YAxis,
  ScatterChart,
  Symbols,
  ResponsiveContainer
} from "recharts";

const endpoint =
  "https://api.coindesk.com/v1/bpi/historical/close.json?currency=SEK";

const colors = ["#fff489", "#fa57c1", "#b166cc", "#7572ff", "#69a6f9"];

const Base = props => {
  const {
    symbol,
    cx,
    cy,
    payload: { y },
    ...rest
  } = props;

  return (
    <g>
      <Symbols type={symbol} cx={cx} cy={cy} {...rest} />
      <g transform={`translate(${cx},${cy})`}>
        <text
          x={0}
          y={-10}
          dy={4}
          textAnchor="right"
          fill="white"
          fontSize="9pt"
        >
          {Math.round(y / 1000)}
        </text>
      </g>
    </g>
  );
};

const symbols = [
  "circle",
  "cross",
  "diamond",
  "square",
  "star",
  "triangle",
  "wye"
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

  const [current = 0] = all.slice(-1);

  return (
    <div>
      <h4>
        Bitcoin price the last 31 days, <br /> in 1000 SEK.
      </h4>
      <span>Last: {Math.round(current / 1000)} x 1000 SEK</span>
      <div>
        <ResponsiveContainer
          width="80%"
          height="80%"
          minWidth="700px"
          aspect={2}
        >
          <ScatterChart margin={{ top: 25, right: 25, bottom: 15, left: 25 }}>
            <XAxis
              dataKey="x"
              tickFormatter={tickFormat}
              axisLine={false}
              height={50}
            />
            <YAxis
              domain={yDomain}
              axisLine={false}
              tickFormatter={x => Math.round(x / 1000)}
              padding={{ bottom: 40 }}
            />
            <Scatter
              data={data}
              type="monotone"
              dataKey="y"
              stroke="#8884d8"
              shape={entry => {
                return (
                  <Base
                    symbol={symbols[Math.round(entry.payload.y) % 7]}
                    fill={colors[Math.round(entry.payload.y) % 5]}
                    {...entry}
                  />
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Bitcoin;
