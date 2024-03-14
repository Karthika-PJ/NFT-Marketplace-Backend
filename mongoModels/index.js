'use strict';

const mongoose = require('mongoose');
const loggerUtil = require('../utilities/logger');

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', (err) => loggerUtil.error({
  message: `MongoDB connection error - ${err.toString()}`,
  level: 'error'
}));
db.once('open', () => loggerUtil.log({
  message: 'MongoDB connected',
  level: 'info'
}));
