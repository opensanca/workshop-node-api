import mongoose from 'mongoose';
import util from 'util';
import config from './src/config/env';
import app from './src/config/express';
import Promise from 'bluebird';
const debug = require('debug')('workshop-node-api:index');


mongoose.Promise = Promise;

// Conectando com mongodb
mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`Falha ao conectar com o BD: ${config.db}`);
});

// Mostrar logs no ambiente de DEV
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

if (!module.parent) {
  app.listen(config.port, () => {
    debug(`Servidor iniciado na porta ${config.port} (${config.env})`);
  });
}

export default app;
