class NonExistingTokenException extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.isSleepy = true;
  }
}

class UnsupportedContractException extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.isSleepy = true;
  }
}

class InvalidTokenIdException extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.isSleepy = true;
  }
}

module.exports = {
  NonExistingTokenException,
  UnsupportedContractException,
  InvalidTokenIdException,
};
