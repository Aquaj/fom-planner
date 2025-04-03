import { serve } from "bun";
import home from "./home.html";

const server = serve({
  port: 3000,
  routes: {
    "/": home,
  },

  development: true,
});

console.log(`Listening on ${server.url}`);
