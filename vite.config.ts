// Standard Vite configuration for a React/TanStack Start project without Lovable dependencies
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    // Ensure the server uses a strict port configuration similar to Lovable setup
    strictPort: true,
    // You can configure the port here if needed, e.g., 5173
  },
  // Add any additional Vite settings here as required
});
