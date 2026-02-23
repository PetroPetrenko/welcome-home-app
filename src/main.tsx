import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Force rebuild — env vars reload
createRoot(document.getElementById("root")!).render(<App />);
