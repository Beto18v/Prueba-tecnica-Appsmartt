module.exports = {
  apps: [
    {
      name: "backend-app",
      script: "./dist/index.js",
      cwd: "/var/www/app/backend",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_file: ".env",
      log_file: "/var/log/pm2/backend-app.log",
      out_file: "/var/log/pm2/backend-app-out.log",
      error_file: "/var/log/pm2/backend-app-error.log",
      time: true,
      watch: false,
      max_memory_restart: "500M",
      restart_delay: 5000,
      max_restarts: 5,
      min_uptime: "10s",
    },
  ],
};
