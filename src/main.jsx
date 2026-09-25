import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App";
import "./index.css";

import Lenis from "lenis";
import "lenis/dist/lenis.css";

const lenis = new Lenis({
  autoRaf: true,
  smoothWheel: true,
  lerp: 0.08,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);