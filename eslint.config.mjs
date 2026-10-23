import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    ignores: ["dist/**", ".next/**", "node_modules/**"],
    rules: {
      "react-hooks/error-boundaries": "off",
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
