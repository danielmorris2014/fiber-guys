import { execSync } from "child_process";
import { rmSync } from "fs";

console.log("Removing node_modules...");
try {
  rmSync("/vercel/share/v0-project/node_modules", { recursive: true, force: true, maxRetries: 3, retryDelay: 1000 });
  console.log("node_modules removed successfully");
} catch (e) {
  console.log("rmSync failed, trying rm -rf...");
  execSync("rm -rf /vercel/share/v0-project/node_modules", { stdio: "inherit" });
  console.log("rm -rf completed");
}

console.log("Removing .next cache...");
try {
  rmSync("/vercel/share/v0-project/.next", { recursive: true, force: true });
  console.log(".next removed successfully");
} catch (e) {
  console.log("No .next to remove");
}

console.log("Reinstalling dependencies...");
execSync("cd /vercel/share/v0-project && npm install", { stdio: "inherit" });
console.log("Dependencies reinstalled successfully!");
