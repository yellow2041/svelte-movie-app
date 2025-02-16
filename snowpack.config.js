const production = process.env.NODE_ENV === "production";

function babelOptions() {
  return { plugins: production ? ["transform-remove-console"] : [] };
}

module.exports = {
  mount: {
    src: "/_dist_",
    public: "/",
  },
  plugins: [
    "@snowpack/plugin-svelte",
    [
      "@snowpack/plugin-babel",
      {
        transformOptions: babelOptions(),
      },
    ],
    "@snowpack/plugin-dotenv",
    "@snowpack/plugin-optimize",
  ],
  alias: {
    "@": "./src",
  },
};
