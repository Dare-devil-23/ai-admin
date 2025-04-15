const fs1 = require("fs");

const crawlableRobotsTxt = `User-agent: *\nAllow: /`;
const uncrawlableRobotsTxt = `User-agent: *\nDisallow: /`;
const NODE_ENV = process.env.NODE_ENV.trim();
let robotsTxt = uncrawlableRobotsTxt;

switch (NODE_ENV) {
  case "prod":
    robotsTxt = crawlableRobotsTxt;
    break
}
fs1.writeFileSync("public/robots.txt", robotsTxt);