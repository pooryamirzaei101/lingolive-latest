import vinext from "vinext";
import { defineConfig } from "vite";

// Production runs as a normal Node service on the Ubuntu VPS. Authentication
// and application data use Supabase; protected media stays on the private VPS
// filesystem and is streamed only through authorized application routes.
export default defineConfig({
  plugins: [vinext()],
  server: {
    host: "0.0.0.0",
  },
});
