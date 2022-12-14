import Listener from "./Listener.js";
import { Key } from "../utils/Enum.js";
import { isKey } from "../utils/util.js";

/**
 * Abstract Bar Listener
 *
 * @abstract
 */
export default class BarListener extends Listener {
  /**
   * Initializes button elements
   *
   * @param {CustomEvent} event
   * @param {HTMLButtonElement} event.detail.element
   * @return {void}
   */
  insertbutton(event) {
    event.detail.element.getAttribute("data-command") &&
      event.detail.element.addEventListener("click", this);
  }

  /**
   * Handles click events
   *
   * @param {MouseEvent} event
   * @return {void}
   */
  click(event) {
    const barItem = event.target.localName === "button" ? event.target : event.currentTarget;
    const command = barItem?.getAttribute("data-command");
    if (command) {
      this.editor.commands.execute(command, barItem);
    }
  }

  /**
   * Handles key combinations for navigation
   *
   * @param {KeyboardEvent} event
   * @param {HTMLElement} event.target
   * @return {void}
   */
  keydown(event) {
    if (isKey(event, [Key.LEFT, Key.RIGHT, Key.HOME, Key.END])) {
      const prev = event.target.previousElementSibling;
      const next = event.target.nextElementSibling;
      const first = event.target.parentElement.firstElementChild;
      const last = event.target.parentElement.lastElementChild;
      const isFirst = event.target === first;
      const isLast = event.target === last;

      if (event.key === Key.LEFT && !isFirst) {
        prev.focus();
      } else if (event.key === Key.RIGHT && !isLast) {
        next.focus();
      } else if (event.key === Key.HOME || (event.key === Key.RIGHT && isLast)) {
        first.focus();
      } else if (event.key === Key.END || (event.key === Key.LEFT && isFirst)) {
        last.focus();
      }

      event.preventDefault();
      event.stopPropagation();
    }
  }
}
