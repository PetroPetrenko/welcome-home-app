import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("[ENV DEBUG] VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("[ENV DEBUG] VITE_SUPABASE_PUBLISHABLE_KEY:", import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? "SET" : "MISSING");
console.log("[ENV DEBUG] All env keys:", Object.keys(import.meta.env));
createRoot(document.getElementById("root")!).render(<App />);
