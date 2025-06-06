# Rover MCP

This package wraps Rover's MCP SSE endpoint, allowing you to use Curio with any MCP client with support for the `stdio` transport.
You can generate an API key from your Rover dashboard.

## Configuration examples

You may have to specify absolute paths in the `command` field below.
If you don't have a JavaScript runtime installed, you can grab a binary from the latest release instead (you will have to manually update it).

### In Zed

If you're using Zed, you can install the [Rover Zed extension](https://github.com/rover-app/zed-extension)
through the Zed extension registry. This is the recommended way to install the Rover MCP server with Zed.

### Using npx

```json
{
  "mcpServers": {
    "rover": {
      "command": "npx",
      "args": ["-y", "@getrover/mcp-cli@latest"],
      "env": {
        "ROVER_API_KEY": "<rak-xxxxxx...>"
      }
    }
  }
}
```

### Using bunx

```json
{
  "mcpServers": {
    "rover": {
      "command": "bunx",
      "args": ["--bun", "@getrover/mcp-cli@latest"],
      "env": {
        "ROVER_API_KEY": "<rak-xxxxxx...>"
      }
    }
  }
}

```

### Using the binary

```sh
# Optionally, put the file somewhere on your path
$ wget -O rover-mcp https://github.com/DocumaticAI/mcp-cli/releases/download/latest/rover-mcp-<os>-<arch>
$ chmod +x rover-mcp
```

```json
{
  "mcpServers": {
    "rover": {
      "command": "/path/to/rover-mcp",
      "env": {
        "ROVER_API_KEY": "<rak-xxxxxx...>"
      }
    }
  }
}

```
