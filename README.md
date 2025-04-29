# Rover MCP

```json
{
  "mcpServers": {
    "rover": {
      "command": "npx", // Or bunx
      "args": ["-y", "@getrover/mcp-cli"],
      "env": {
        "ROVER_API_KEY": "",
        "ROVER_REPO_ID": "",
      }
    }
  }
}
```

This package wraps Rover's MCP SSE endpoint, allowing you to connect Rover to any MCP client with support for the `stdio` transport.
You should configure Rover on a per-project basis, with the appropriate `ROVER_REPO_ID`.

## Environment Variables

You can find these in your Rover dashboard.

- `ROVER_API_KEY` - Your rover API key
- `ROVER_REPO_ID` - The ID of the repository for the current project
