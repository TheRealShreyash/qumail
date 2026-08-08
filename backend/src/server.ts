import http from "node:http";
import "dotenv/config";
import { createApplication } from "./app";

async function main() {
  try {
    const server = http.createServer(createApplication());
    const PORT = process.env.PORT || 8080;

    server.listen(PORT, () => {
      console.log(`HTTP server started at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Error starting http server:`, error);
    process.exit(1);
  }
}

main();
