# Rover MCP

```json
{
  "mcpServers": {
    "rover": {
      "command": "npx", // Or bunx
      "args": ["-y", "@getrover/mcp-cli"],
      "env": {
        "ROVER_API_KEY": ""
      }
    }
  }
}
```

This package wraps Rover's MCP SSE endpoint, allowing you to connect Rover to any MCP client with support for the `stdio` transport.
You can generate an API key from your Rover dashboard.
