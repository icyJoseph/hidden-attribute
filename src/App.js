import React from "react";
import Tabs from "./components/Tabs";
import Tab from "./components/Tab";

import Landing from "./containers/Landing";
import Bitcoin from "./containers/Bitcoin";
import Pokemon from "./containers/Pokemon";
import ScrollBars from "./components/ScrollBars";

export function App() {
  return (
    <ScrollBars>
      <div className="container">
        <div className="nes-container is-dark">
          <h1 className="nes-text is-disabled with-work-break">Parcel App</h1>
        </div>
        <Tabs>
          <Tab order={0} label="1st" title="First Tab" importance="is-primary">
            <Landing />
          </Tab>
          <Tab order={1} label="2nd" title="Second Tab" importance="is-success">
            <Bitcoin />
          </Tab>
          <Tab order={2} label="3rd" title="Third Tab" importance="is-error">
            <Pokemon />
          </Tab>
        </Tabs>
      </div>
    </ScrollBars>
  );
}

export default App;
