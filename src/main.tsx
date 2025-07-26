import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element");
}

createRoot(rootElement).render(
  <ThemeProvider defaultTheme="system" storageKey="droguerie-ui-theme">
    <App />
  </ThemeProvider>
);
