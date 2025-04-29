import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { proxyServer } from "mcp-proxy";
import { loadEnv, log } from "./utils";

async function main() {
	const envResult = loadEnv();
	if (!envResult.ok) {
		const errors = envResult.error.flatten();
		log("missing or malformed environment variables", errors.fieldErrors);
		process.exit(1);
	}

	const { ROVER_HOST, ROVER_API_KEY, ROVER_REPO_ID } = envResult.data;
	const SSE_URL = `${ROVER_HOST}/mcp/${ROVER_REPO_ID}/sse`;

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
		version: "0.0.1",
	});

	log(`connecting to Rover`, { sse: SSE_URL });
	try {
		await client.connect(createClientTransport());
	} catch (error) {
		log("failed to connect", { error });
		process.exit(1);
	}

	const serverInfo = client.getServerVersion();
	const serverCapabilities = client.getServerCapabilities();
	log("connected", {
		info: serverInfo,
		capabilities: serverCapabilities,
	});

	const serverTransport = new StdioServerTransport();
	const server = new McpServer(
		{
			// At this point, this information is available
			name: serverInfo?.name!,
			version: serverInfo?.version!,
		},
		{
			capabilities: {
				tools: serverCapabilities?.tools,
			},
		},
	);
	await server.connect(serverTransport);

	log("starting proxy");
	try {
		await proxyServer({
			server: server.server,
			client: client,
			serverCapabilities: {
				tools: serverCapabilities?.tools,
			},
		});
	} catch (error) {
		log("failed to run proxy", { error });
		process.exit(1);
	}
}

main();
