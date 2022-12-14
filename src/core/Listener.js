import Editor from "./Editor.js";
import { ErrorMessage } from "../utils/Enum.js";
import { isFunction } from "../utils/util.js";

/**
 * Listener
 *
 * @implements EventListener
 */
export default class Listener {
  /**
   * Editor
   *
   * @type {Editor}
   */
  #editor;

  /**
   * Allows read access to editor
   *
   * @return {Editor}
   */
  get editor() {
    return this.#editor;
  }

  /**
   * Initializes a new listener
   *
   * @borrows Listener.handleEvent
   * @param {Editor} editor
   */
  constructor(editor) {
    if (!(editor instanceof Editor)) {
      throw new Error(ErrorMessage.INVALID_ARGUMENT);
    }

    this.#editor = editor;
  }

  /**
   * Handles events
   *
   * @param {Event} event
   * @return {void}
   */
  handleEvent(event) {
    isFunction(this[event.type]) && this[event.type](event);
  }
}
