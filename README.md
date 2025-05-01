# Rover MCP

```json
{
  "mcpServers": {
    "rover": {
      "command": "npx", // Or bunx
      "args": ["-y", "@getrover/mcp-cli@latest"],
      "env": {
        "ROVER_API_KEY": ""
      }
    }
  }
}
```

This package wraps Rover's MCP SSE endpoint, allowing you to use Curio with any MCP client with support for the `stdio` transport.
You can generate an API key from your Rover dashboard.
