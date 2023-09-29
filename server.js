import createError from "http-errors";
import debugLib from 'debug';
import http from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import FtpSrv from "ftp-srv";

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import photosRouter from './routes/photos.js';
import configRouter from "./routes/config.js";

const debug = debugLib('your-project-name:server');
const port = normalizePort(process.env.PORT || '3000');
const ftpPort = normalizePort(process.env.FTP_PORT || '3021');

const ftpServer = new FtpSrv({
  url: "ftp://0.0.0.0:" + ftpPort
});

ftpServer.on('login', (username, password) => {
  if (username === 'admin' && password === 'admin') {
    debug('Login success');
    return resolve({ root:"/" });    
  } else {
    debug('Login failed');
    return reject(new errors.GeneralError('Invalid username or password', 401));
  }
});

ftpServer.listen().then(() => { 
  console.log('Ftp server is starting...')
});

var app = express();

app.set('port', port);

app.set('views', './views');
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('./public'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/photos', photosRouter);
app.use('/config', configRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
  
function normalizePort(val) {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }
  
export default app;