// Adapted from: https://stackoverflow.com/a/72751924

export class Timer {
  callback: () => void;
  remaining: number;
  start: number | undefined;
  timerId: number | undefined | null;

  constructor(callback: () => void, delay: number) {
    this.remaining = delay;
    this.callback = callback;
    this.timerId = undefined;
    this.start = undefined;
    this.resume();
  }

  clear() {
    if (this.timerId) {
      window.clearTimeout(this.timerId);
    }
    this.timerId = null;
  }

  pause() {
    if (this.timerId) {
      window.clearTimeout(this.timerId);
    }
    this.timerId = null;
    if (this.start) {
      this.remaining -= Date.now() - this.start;
    }
  }

  resume() {
    if (this.timerId) {
      return;
    }

    this.start = Date.now();
    this.timerId = window.setTimeout(this.callback, this.remaining);
  }
}
