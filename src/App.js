import Tabs from "./components/Tabs";
import Tab from "./components/Tab";
import ScrollBars from "./components/ScrollBars";

import { SuspenseLanding, SuspenseBitcoin, SuspensePokemon } from "./loadables";

const LandingLabel = () => <i className="nes-octocat animate" />;
const BitCoinLabel = () => <i className="nes-icon coin is-large" />;
const PokemonLabel = () => <i className="nes-pokeball" />;

export function App() {
  return (
    <ScrollBars>
      <div className="container">
        <div className="nes-container is-dark">
          <h1 className="nes-text with-word-break">Hidden Attr</h1>
        </div>
        <Tabs>
          <Tab label={<LandingLabel />} title="Landing" importance="is-primary">
            <SuspenseLanding />
          </Tab>
          <Tab label={<BitCoinLabel />} title="Bitcoin" importance="is-success">
            <SuspenseBitcoin />
          </Tab>
          <Tab label={<PokemonLabel />} title="Pokemon" importance="is-error">
            <SuspensePokemon />
          </Tab>
        </Tabs>
      </div>
    </ScrollBars>
  );
}

export default App;
