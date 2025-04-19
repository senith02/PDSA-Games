const { fork } = require('child_process');
const path = require('path');

// List of server files to run
const servers = [
  path.join(__dirname, 'travelingSalesmenBE', 'tspserver.js'),
  // Add paths to other server files here
  // path.join(__dirname, 'anotherServer.js'),
  // path.join(__dirname, 'yetAnotherServer.js'),
];

// Fork each server file
servers.forEach((serverPath) => {
  const child = fork(serverPath);

  child.on('message', (message) => {
    console.log(`[${serverPath}] Message:`, message);
  });

  child.on('error', (error) => {
    console.error(`[${serverPath}] Error:`, error);
  });

  child.on('exit', (code) => {
    console.log(`[${serverPath}] Exited with code:`, code);
  });
});

console.log('All servers are running.');