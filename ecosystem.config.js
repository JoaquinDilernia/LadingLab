module.exports = {
  apps: [
    {
      name: "landinglab-emulator",
      script: "start-emulator.js",
      cwd: "C:/Users/Usuario/Desktop/LandingLab",
      interpreter: "node",
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 3000,
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
