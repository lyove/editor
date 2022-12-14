import Listener from "./Listener.js";
import { Key } from "../utils/Enum.js";
import { isKey } from "../utils/util.js";

/**
 * Deletable Listener
 */
export default class DeletableListener extends Listener {
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
    if (event.detail.element.hasAttribute("data-deletable")) {
      event.detail.element.addEventListener("keydown", this);
    }
  }

  /**
   * Handles key combinations for delete
   *
   * @param {KeyboardEvent} event
   * @param {HTMLElement} event.target
   * @return {void}
   */
  keydown(event) {
    if (event.target === event.currentTarget && isKey(event, Key.DEL, { ctrl: true })) {
      this.editor.dom.delete(event.target);
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
