// https://bun.sh/docs/bundler/executables#cross-compile-to-other-platforms
const BUN_BINARY_TARGETS = [
	"linux-x64",
	"linux-arm64",
	"linux-x64-musl",
	"linux-arm64-musl",
	"windows-x64",
	"darwin-x64",
	"darwin-arm64",
];

await Bun.$`rm -rf ./dist`;

if (process.argv[2] === "compile") {
	await Bun.$`mkdir -p ./dist`;

	for (const target of BUN_BINARY_TARGETS) {
		let suffix = target.replaceAll("-", "_");
		if (target.includes("windows")) {
			suffix += ".exe";
		}

		await Bun.$`bun build --target=bun-${target} --compile --minify --sourcemap --bytecode src/index.ts --outfile=dist/rover_mcp_${suffix}`;
	}
} else {
	await Bun.build({
		minify: true,
		target: "node",
		outdir: "./dist",
		sourcemap: "external",
		entrypoints: ["./src/index.ts"],
	});
}
