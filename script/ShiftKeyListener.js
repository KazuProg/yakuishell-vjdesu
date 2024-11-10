/**
 * Class for listening to Shift key presses and releases.
 * Provides methods to handle keydown and keyup events for Shift key.
 */
export default class ShiftKeyListener {
  #onShiftDown;
  #onShiftUp;
  #isShiftPressed;

  /**
   * Creates an instance of ShiftKeyListener.
   * @param {function} onShiftDown - Callback invoked when Shift key is pressed down.
   * @param {function} onShiftUp - Callback invoked when Shift key is released.
   */
  constructor(onShiftDown, onShiftUp) {
    this.#onShiftDown = onShiftDown;
    this.#onShiftUp = onShiftUp;
    this.#isShiftPressed = false;

    window.addEventListener("keydown", this.#handleKeyDown.bind(this));
    window.addEventListener("keyup", this.#handleKeyUp.bind(this));
  }

  /**
   * Returns the current status of Shift key (pressed or not).
   * @returns {boolean} True if Shift key is pressed, false otherwise.
   */
  get isShiftPressed() {
    return this.#isShiftPressed;
  }

  /**
   * Handles the keydown event and triggers the onShiftDown callback when the Shift key is pressed.
   * Ignores the event if the target element is a form element (input, textarea, select, button).
   * @param {KeyboardEvent} event - The keydown event.
   * @private
   */
  #handleKeyDown(event) {
    if (isFormElement(event.target)) {
      return;
    }

    if (event.key === "Shift" && !this.#isShiftPressed) {
      this.#isShiftPressed = true;
      this.#onShiftDown();
    }
  }

  /**
   * Handles the keyup event and triggers the onShiftUp callback when the Shift key is released.
   * @param {KeyboardEvent} event - The keyup event.
   * @private
   */
  #handleKeyUp(event) {
    if (event.key === "Shift" && this.#isShiftPressed) {
      this.#isShiftPressed = false;
      this.#onShiftUp();
    }
  }

  /**
   * Removes event listeners for keydown and keyup events.
   * This should be called when the instance is no longer needed to avoid memory leaks.
   */
  destroy() {
    window.removeEventListener("keydown", this.#handleKeyDown.bind(this));
    window.removeEventListener("keyup", this.#handleKeyUp.bind(this));
  }
}

/**
 * Checks if the target element is one of the form elements.
 * @param {Element} element - The element to check.
 * @returns {boolean} True if the element is an input, textarea, select, or button.
 * @private
 */
function isFormElement(element) {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLButtonElement
  );
}
