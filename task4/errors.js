export class NetworkError extends Error {
  constructor(message) {
    super(message);       
    this.name = "NetworkError";
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}
