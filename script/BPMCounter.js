/**
 * Class for calculating Beats Per Minute (BPM) based on timestamps.
 * Records timestamps on each call and calculates BPM based on average interval.
 */
export default class BPMCounter {
  #onBPMChange;
  #timestamps = [];
  #resetTimer;

  /**
   * Creates a BPMCounter instance.
   * @param {function(number):void} onBPMChange - Callback function invoked with calculated BPM on each update.
   */
  constructor(onBPMChange) {
    this.#onBPMChange = onBPMChange;
  }

  /**
   * Records the current timestamp and calculates BPM if more than one timestamp is recorded.
   * Resets timestamps if idle for twice the average interval.
   */
  recordTimestamp() {
    const now = Date.now();
    this.#timestamps.push(now);

    if (this.#timestamps.length > 10) {
      this.#timestamps = this.#timestamps.slice(-10);
    }

    if (this.#timestamps.length > 1) {
      this.#calculateBPM();

      if (this.#resetTimer) {
        clearTimeout(this.#resetTimer);
      }

      const avgInterval = this.#averageInterval();
      this.#resetTimer = setTimeout(() => {
        this.#timestamps = [];
      }, avgInterval * 2);
    }
  }

  /**
   * Calculates BPM based on average intervals between timestamps.
   * This uses the formula: BPM = 60000 / avgInterval (milliseconds).
   * Invokes callback with the calculated BPM.
   * @private
   */
  #calculateBPM() {
    const avgInterval = this.#averageInterval();
    const bpm = 60000 / avgInterval;
    this.#onBPMChange(bpm);
  }

  /**
   * Calculates and returns the average interval between recorded timestamps.
   * @returns {number} The average interval in milliseconds.
   * @private
   */
  #averageInterval() {
    if (this.#timestamps.length <= 1) return 0;

    const intervals = this.#timestamps
      .map((t, i, arr) => (i > 0 ? t - arr[i - 1] : null))
      .slice(1);

    return intervals.reduce((a, b) => a + b) / intervals.length;
  }
}
