import { serve } from "bun";
import home from "./home.html";

// Import app to initialize the application
import "./src/core/app";

const server = serve({
  port: 3000,
  routes: {
    "/": home,
  },

  development: true,
});

console.log(`Listening on ${server.url}`);
