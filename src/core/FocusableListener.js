import Listener from "./Listener.js";

/**
 * Focusable Listener
 */
export default class FocusableListener extends Listener {
  /**
   * @inheritDoc
   */
  constructor(editor) {
    super(editor);
    this.editor.textarea.addEventListener("insert", this);
  }

  /**
   * Initializes elements
   *
   * @param {CustomEvent} event
   * @param {HTMLElement} event.detail.element
   * @return {void}
   */
  insert(event) {
    if (event.detail.element.hasAttribute("data-focusable")) {
      event.detail.element.focus();
    }
  }
}
