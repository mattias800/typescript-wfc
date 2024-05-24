const CANCEL = Symbol();

export class CancellationToken {
  cancelled: boolean = false;

  constructor() {
    this.cancelled = false;
  }

  throwIfCancelled() {
    if (this.isCancelled()) {
      throw "Cancelled!";
    }
  }

  isCancelled() {
    return this.cancelled;
  }

  cancel() {
    this.cancelled = true;
  }

  [CANCEL]() {
    this.cancelled = true;
  }
}
