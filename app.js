'use strict';

const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const config  = require('./config');
const routes = require('./routes');
const loggerUtil = require('./utilities/logger');
require('./mongoModels');
// require('./utilities/IPFSUtils').testIPFSAuth();


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: loggerUtil.stream }));
app.use(express.static(path.join(__dirname, 'public')));

require('./utilities/queueUtils').consumeQueue(config.QUEUE.minting,require('./modules/contract-management/contractController').consumeMintQueue);
require('./utilities/queueUtils').consumeQueue(config.QUEUE.transfering,require('./modules/contract-management/contractController').consumeTransferQueue);
require('./utilities/queueUtils').consumeQueue(config.QUEUE.endingAuction,require('./modules/contract-management/contractController').consumeAuctionEndQueue);
require('./utilities/queueUtils').consumeQueue(config.QUEUE.startAuction,require('./modules/contract-management/contractController').consumeAuctionStartQueue);
require('./utilities/queueUtils').consumeQueue(config.QUEUE.mintAndTransfer,require('./modules/contract-management/contractController').consumeMintAndTransferQueue);
require('./utilities/queueUtils').consumeQueue(config.QUEUE.updateMaintainer,require('./modules/contract-management/contractController').consumeUpdateMaintainerQueue);

app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
