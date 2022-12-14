import Listener from "./Listener.js";
import { Key, Position, TagName } from "../utils/Enum.js";
import { isKey } from "../utils/util.js";

/**
 * Editable Listener
 */
export default class EditableListener extends Listener {
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
    if (event.detail.element?.contentEditable === "true") {
      event.detail.element.addEventListener("keydown", this);
    } else if (event.detail.element?.parentElement?.contentEditable === "true") {
      event.detail.element.addEventListener("dblclick", this);
    }
  }

  /**
   * Handles enter and backspace keydown events
   *
   * @param {KeyboardEvent} event
   * @param {HTMLElement} event.target
   * @return {void}
   */
  keydown(event) {
    if (
      isKey(event, Key.ENTER, { shift: true }) &&
      !this.editor.tags.allowed(event.target, TagName.BR)
    ) {
      event.preventDefault();
      event.stopPropagation();
    } else if (isKey(event, Key.ENTER)) {
      event.preventDefault();
      event.stopPropagation();
      const enter = this.editor.tags.get(event.target)?.enter;

      if (enter) {
        if (event.target.textContent.trim() || !event.target.hasAttribute("data-deletable")) {
          this.editor.dom
            .closest(event.target, enter)
            ?.insertAdjacentElement(Position.AFTEREND, this.editor.dom.createElement(enter));
        } else if (!(event.target instanceof HTMLParagraphElement)) {
          this.editor.dom
            .closest(event.target, TagName.P)
            ?.insertAdjacentElement(Position.AFTEREND, this.editor.dom.createElement(TagName.P));
          event.target.parentElement.removeChild(event.target);
        }
      }
    } else if (
      isKey(event, Key.BACKSPACE) &&
      !event.target.textContent &&
      event.target.hasAttribute("data-deletable")
    ) {
      this.editor.dom.delete(event.target);
      event.preventDefault();
      event.stopPropagation();
    } else if (/^[A-Z]$/.test(event.key) && isKey(event, event.key, { alt: true, shift: true })) {
      event.preventDefault();
      event.stopPropagation();
      this.editor.formatbar
        .querySelector(`${TagName.BUTTON}[data-key=${event.key.toLowerCase()}]`)
        ?.click();
    }
  }

  /**
   * Handles double-click events on format elements
   *
   * @param {MouseEvent} event
   * @param {HTMLElement} event.target
   * @return {void}
   */
  dblclick(event) {
    this.editor.dom.selectContents(event.target);
    this.editor.commands.find(event.target.localName)?.execute();
  }
}
