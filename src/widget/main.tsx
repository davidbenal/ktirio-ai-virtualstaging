import { createRoot } from "react-dom/client";
import VirtualStagingWidget from "./VirtualStagingWidget";
import "../styles/index.css";

createRoot(document.getElementById("root")!).render(
    <VirtualStagingWidget />
);
