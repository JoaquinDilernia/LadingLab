// Wrapper para que pm2 pueda manejar el emulador de Firebase en Windows
const { spawn } = require("child_process");
const path = require("path");

const firebaseBin = path.join(
  process.env.APPDATA,
  "npm",
  "firebase.cmd"
);

const proc = spawn(firebaseBin, ["emulators:start", "--only", "functions"], {
  cwd: __dirname,
  stdio: "inherit",
  shell: true,
});

proc.on("exit", (code) => {
  console.log(`Emulator exited with code ${code}`);
  process.exit(code ?? 1);
});

proc.on("error", (err) => {
  console.error("Failed to start emulator:", err);
  process.exit(1);
});
