module.exports = {
    apps: [
      {
        name: 'socket-server',
        script: 'index.js',
        instances: 1,
        exec_mode: 'fork',
        env: {
          PORT: 8888
        }
      },
      {
        name: 'express-server',
        script: 'server.js',
        instances: 1,
        exec_mode: 'fork',
        env: {
          PORT: 8889
        }
      }
    ]
  };