import httpStatus from 'http-status';
import ExtendableError from './ExtendableError';

class APIError extends ExtendableError {

  constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
    super(message, status, isPublic);
  }
  
}

export default APIError;
