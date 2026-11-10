import vinext from "vinext";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";

// Production runs as a normal Node service on the Ubuntu VPS. Authentication
// and application data use Supabase; protected media stays on the private VPS
// filesystem and is streamed only through authorized application routes.
export default defineConfig(async () => {
  const { cloudflare } = await import("@cloudflare/vite-plugin");
  return {
    plugins: [
      vinext(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
        config: {
          main: "./build/sites-worker.ts",
          compatibility_flags: ["nodejs_compat"],
          d1_databases: hostingConfig.d1
            ? [{ binding: hostingConfig.d1, database_name: "site-creator-d1", database_id: "00000000-0000-4000-8000-000000000000" }]
            : [],
          r2_buckets: hostingConfig.r2
            ? [{ binding: hostingConfig.r2, bucket_name: "site-creator-r2" }]
            : [],
        },
      }),
    ],
    resolve: { dedupe: ["react", "react-dom"] },
    server: { host: "0.0.0.0" },
  };
});
