const rf = require('./readFileThunk.js');
const app = require('koa')();
const logger = require('koa-logger');
const jsonBody = require('koa-json-body');
const serve = require('koa-static-folder');
const router = require('koa-router')();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8080;

mongoose.connect(''); // Enter mongo URI

app.use(serve('./public'));
router.get('/', function* appStatus() {
  this.body = yield rf.readFile('./public/index.html');
});

// ROUTERS
require('./routers/event')(router);
require('./routers/events')(router);
require('./routers/kiqituser')(router);
require('./routers/kiqitAdminUser')(router);

// Koa Dependencies
app
  .use(logger())
  .use(jsonBody())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT);
