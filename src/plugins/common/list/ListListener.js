import Listener from "../../../core/Listener.js";
import { TagName } from "../../../utils/Enum.js";

/**
 * Handles list elements
 */
export default class ListListener extends Listener {
  /**
   * @inheritDoc
   */
  constructor(editor) {
    super(editor);
    this.editor.textarea.addEventListener("sethtml", this);
    this.editor.textarea.addEventListener("insertli", this);
    this.editor.textarea.addEventListener("deleteli", this);
    this.editor.textarea.addEventListener("insertol", this);
    this.editor.textarea.addEventListener("insertul", this);
  }

  /**
   * Initializes list item elements when editor html is set
   *
   * @param {CustomEvent} event
   * @param {HTMLElement} event.detail.element
   * @return {void}
   */
  sethtml(event) {
    Array.from(event.detail.element.getElementsByTagName(TagName.LI)).forEach((item) =>
      this.#init(item),
    );
  }

  /**
   * Initializes listitem elements
   *
   * @param {CustomEvent} event
   * @param {HTMLLIElement} event.detail.element
   * @return {void}
   */
  insertli(event) {
    this.#init(event.detail.element);
  }

  /**
   * Removes parent element too if deleted listitem was the only child
   *
   * @param {CustomEvent} event
   * @param {HTMLOListElement|HTMLUListElement} event.detail.target
   * @return {void}
   */
  deleteli(event) {
    if (event.detail.target.children.length === 0) {
      event.detail.target.parentElement.removeChild(event.detail.target);
    }
  }

  /**
   * Initializes orderedList elements
   *
   * @param {CustomEvent} event
   * @param {HTMLOListElement} event.detail.element
   * @return {void}
   */
  insertol(event) {
    if (event.detail.element.children.length === 0) {
      event.detail.element.appendChild(this.editor.dom.createElement(TagName.LI));
    }
  }

  /**
   * Initializes unorderedList elements
   *
   * @param {CustomEvent} event
   * @return {void}
   */
  insertul(event) {
    this.insertol(event);
  }

  /**
   * Initializes listitem elements
   *
   * @param {HTMLLIElement} element
   * @return {void}
   */
  #init(element) {
    if (
      !(element.parentElement instanceof HTMLOListElement) &&
      !(element.parentElement instanceof HTMLUListElement)
    ) {
      this.editor.dom.wrap(element, TagName.UL);
    }
  }
}
