import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

const host = document.getElementById("root");
const root = createRoot(host)

root.render(<App />)
