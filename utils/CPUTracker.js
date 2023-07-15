const os = require('os');
const { exec } = require('child_process');

const CPU_THRESHOLD = 70;

// Function to check CPU usage and restart server if necessary
function checkCPUUsage() {
  const cpuUsage = os.loadavg()[0];

  console.log(`Current CPU Usage: ${cpuUsage}%`);

  if (cpuUsage >= CPU_THRESHOLD) {
    console.log('CPU usage is high. Restarting the server...');
    restartServer();
  } else {
    setTimeout(checkCPUUsage, 5000);
  }
}

// Function to restart the server
function restartServer() {
  exec('pm2 restart server', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error restarting server: ${error}`);
    } else {
      console.log('Server restarted successfully');
    }
    setTimeout(checkCPUUsage, 5000);
  });
}

module.exports = { checkCPUUsage };
