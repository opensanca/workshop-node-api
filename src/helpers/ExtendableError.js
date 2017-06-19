class ExtendableError extends Error {
  constructor(message, status, isPublic) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true; // Isso é necessário, pois o bluebird 4 não o anexa mais.
    Error.captureStackTrace(this, this.constructor.name);
  }
}

export default ExtendableError;