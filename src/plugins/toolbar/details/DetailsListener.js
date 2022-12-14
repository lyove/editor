import Listener from "../../../core/Listener.js";
import Details from "./Details.js";
import { Key, Position, TagName } from "../../../utils/Enum.js";
import { isKey } from "../../../utils/util.js";

/**
 * Handles details elements
 */
export default class DetailsListener extends Listener {
  /**
   * @inheritDoc
   */
  constructor(editor) {
    super(editor);
    this.editor.textarea.addEventListener("insertdetails", this);
    this.editor.textarea.addEventListener("insertsummary", this);
  }

  /**
   * Initializes details elements
   *
   * @param {CustomEvent} event
   * @param {HTMLDetailsElement} event.detail.element
   * @return {void}
   */
  insertdetails(event) {
    event.detail.element.setAttribute("open", true);

    if (!event.detail.element.querySelector(`:scope > ${TagName.SUMMARY}:first-child`)) {
      event.detail.element.insertAdjacentElement(
        Position.AFTERBEGIN,
        this.editor.dom.createElement(TagName.SUMMARY),
      );
    }
  }

  /**
   * Initializes summary elements
   *
   * @param {CustomEvent} event
   * @param {HTMLElement} event.detail.element
   * @return {void}
   */
  insertsummary(event) {
    this.#empty(event.detail.element);
    event.detail.element.addEventListener("click", this);
    event.detail.element.addEventListener("blur", this);
    event.detail.element.addEventListener("keydown", this);
  }

  /**
   * Prevents toggling details open state
   *
   * @param {MouseEvent} event
   * @param {HTMLElement} event.target
   * @return {void}
   */
  click(event) {
    event.preventDefault();
    event.stopPropagation();
    event.target.parentElement.setAttribute("open", true);
  }

  /**
   * Sets default summary text content if it's empty
   *
   * @param {FocusEvent} event
   * @param {HTMLElement} event.target
   * @return {void}
   */
  blur(event) {
    this.#empty(event.target);
  }

  /**
   * Fixes space and enter key handling for editable summary elements
   *
   * @param {KeyboardEvent} event
   * @param {HTMLElement} event.target
   * @return {void}
   */
  keydown(event) {
    if (isKey(event, Key.SPACE)) {
      event.preventDefault();
      event.stopPropagation();
      this.editor.dom.insertText(" ");
    } else if (isKey(event, Key.ENTER)) {
      event.preventDefault();
      event.stopPropagation();
      event.target.parentElement.setAttribute("open", true);
    }
  }

  /**
   * Ensures summary element is not empty to avoid strange browser behaviour
   *
   * @param {HTMLElement} element
   * @return {void}
   */
  #empty(element) {
    if (!element.textContent.trim()) {
      element.textContent = this.editor.translator.translate(Details.name, "Details");
    } else {
      element
        .querySelectorAll(TagName.BR + ":not(:last-child)")
        .forEach((item) => item.parentElement.removeChild(item));
    }

    element.lastElementChild instanceof HTMLBRElement ||
      element.appendChild(this.editor.dom.createElement(TagName.BR));
  }
}
