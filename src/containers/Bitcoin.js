import useSWRImmutable from "swr/immutable";
import { VictoryChart, VictoryScatter, VictoryAxis } from "victory";

const endpoint =
  "https://httpbin.dev/bytes/30";

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

async function fetcher() {
  const res = await fetch(endpoint)

  const buffer = await res.arrayBuffer()

  const data = Array.from(new Uint8Array(buffer)).map((y, x) => ({ x, y }))

  return data
}


export function Bitcoin() {
  const { data } = useSWRImmutable("bytes", fetcher, { suspense: true })

  return (
    <div>
      <h4>
        Thirty random bytes
      </h4>

      <VictoryChart style={{ parent: { height: "75vh" } }}>
        <VictoryScatter
          data={data}
          domain={{ y: [0, 255] }}
          labels={({ datum }) => {
            return Math.round(100 * (datum.y / 255));
          }}
          symbol={(datum) => symbols[Math.round(datum.x) % 7]}
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
          tickCount={5}
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
