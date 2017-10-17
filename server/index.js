import http from 'http';
import app from './app';

// app.use('/', renderedPageRouter);
const server = http.createServer(app);
server.listen(3001, () => {
  console.log('App started on port 3001');
});
