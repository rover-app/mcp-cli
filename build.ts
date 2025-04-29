await Bun.$`rm -rf ./dist`;
await Bun.build({
  minify: true,
  target: "node",
  outdir: "./dist",
  format: "cjs",
  sourcemap: "external",
  banner: "#!/usr/bin/env node",
  entrypoints: ["./src/index.ts"],
});
