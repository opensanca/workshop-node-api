import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import helmet from 'helmet';
import winstonInstance from './winston';
import config from './env';
import APIError from '../helpers/APIError';
import routes from './routes';

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(methodOverride());

// Segurar a app apps setando vários HTTP headers
app.use(helmet());

// Habilitar CORS - Cross Origin Resource Sharing
app.use(cors());

// habilitar o log detalhado da API no ambiente de dev
if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true, 
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true // Corrige o código de status (default green, 3XX cyan, 4XX yellow, 5XX red).
  }));
}

// montar todas as rotas no caminho /api
app.use('/api', routes);

// se o erro não é uma instância de APIError, converta-o.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // erro de validação contém erros que é uma matriz de erro contendo cada uma mensagem []
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// pegar 404 e encaminhar para o manipulador de erros
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }));
}

// manipulador de erros, envie stacktrace somente durante o desenvolvimento
app.use((err, req, res, next) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  })
);

export default app;