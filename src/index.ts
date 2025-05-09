import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { proxyServer } from "mcp-proxy";
import updateNotifier from "update-notifier";
import pkgJson from "../package.json";
import { loadEnv, log } from "./utils";

async function main() {
	const notifier = updateNotifier({ pkg: pkgJson });
	if (notifier.update) {
		log("a new version is available", {
			current: notifier.update.current,
			latest: notifier.update.latest,
		});
	}

	const envResult = loadEnv();
	if (!envResult.ok) {
		const errors = envResult.error.flatten();
		log("missing or malformed environment variables", errors.fieldErrors);
		process.exit(1);
	}

	const { ROVER_HOST, ROVER_API_KEY } = envResult.data;
	const SSE_URL = `${ROVER_HOST}/mcp/sse`;

	const getCommonHeaders = () => ({
		authorization: `Bearer ${ROVER_API_KEY}`,
	});

	const createClientTransport = () => {
		return new SSEClientTransport(new URL(SSE_URL), {
			eventSourceInit: {
				fetch(url, init) {
					return fetch(url, {
						...init,
						headers: {
							...init?.headers,
							...getCommonHeaders(),
						},
					});
				},
			},
			requestInit: {
				headers: getCommonHeaders(),
			},
		});
	};
	const client = new Client({
		name: "rover-mcp-proxy",
		version: pkgJson.version,
	});

	log("connecting to Rover", { sse: SSE_URL });
	try {
		await client.connect(createClientTransport());
	} catch (error) {
		log("failed to connect", {
			error: error instanceof Error ? error.message : String(error),
		});
		process.exit(1);
	}

	const serverInfo = client.getServerVersion();
	if (!serverInfo) {
		log("connected but server info missing");
		process.exit(1);
	}

	const serverCapabilities = client.getServerCapabilities();
	if (!serverCapabilities) {
		log("connected but server capabilities missing");
		process.exit(1);
	}

	log("connected", {
		info: serverInfo,
		capabilities: serverCapabilities,
	});

	const serverTransport = new StdioServerTransport();
	const server = new McpServer(
		{
			name: serverInfo.name,
			version: serverInfo.version,
		},
		{
			capabilities: serverCapabilities,
		},
	);
	await server.connect(serverTransport);

	log("starting proxy");
	try {
		await proxyServer({
			server: server.server,
			client: client,
			serverCapabilities,
		});
	} catch (error) {
		log("failed to run proxy", {
			error: error instanceof Error ? error.message : String(error),
		});
		process.exit(1);
	}
}

main();
