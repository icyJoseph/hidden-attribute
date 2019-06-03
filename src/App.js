import React from "react";
import Tabs from "./components/Tabs";
import Tab from "./components/Tab";

export function App() {
  return (
    <div className="container">
      <div className="nes-container is-dark">
        <h1 className="nes-text is-disabled">Parcel App</h1>
      </div>
      <Tabs>
        <Tab order={0} label="1st" title="First Tab" importance="is-primary">
          <p>First</p>
        </Tab>
        <Tab order={1} label="2nd" title="Second Tab" importance="is-success">
          <p>Second</p>
        </Tab>
        <Tab order={2} label="3rd" title="Third Tab" importance="is-error">
          <p>Third</p>
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
