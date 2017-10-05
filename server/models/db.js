import mongoose from 'mongoose';
const dbURI = 'mongodb://localhost/issuetracker';
mongoose.connect(dbURI);

const gracefulShutdown = (msg, cb) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    cb();
  });
};

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', err => {
  console.log(`Mongoose connection error ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});


// Listen for SIGUSR2, which is what nodemon uses
process.once('SIGUSR2', () => {
  // Send message to graceful- Shutdown and callback to kill process, emitting SIGUSR2 again
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// Listen for SIGINT emitted on application termination
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});
