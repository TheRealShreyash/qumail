import "dotenv/config";
import { createApplication } from "./app";

const app = createApplication();

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`HTTP server started at http://localhost:${PORT}`);
  });
}

export default app;
