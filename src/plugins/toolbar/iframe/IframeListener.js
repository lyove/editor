import Listener from "../../../core/Listener.js";
import Iframe from "./Iframe.js";
import { TagName } from "../../../utils/Enum.js";

/**
 * Handles iframe elements
 */
export default class IframeListener extends Listener {
  /**
   * @inheritDoc
   */
  constructor(editor) {
    super(editor);
    this.editor.textarea.addEventListener("sethtml", this);
    this.editor.textarea.addEventListener("insertiframe", this);
  }

  /**
   * Initializes iframe elements when editor html is set
   *
   * @param {CustomEvent} event
   * @param {HTMLElement} event.detail.element
   * @return {void}
   */
  sethtml(event) {
    Array.from(event.detail.element.getElementsByTagName(TagName.IFRAME)).forEach((item) =>
      this.#init(item),
    );
  }

  /**
   * Initializes elements
   *
   * @param {CustomEvent} event
   * @param {HTMLIFrameElement} event.detail.element
   * @return {void}
   */
  insertiframe(event) {
    this.#init(event.detail.element);
  }

  /**
   * Initializes iframe element
   *
   * @param {HTMLIFrameElement} element
   * @return {void}
   */
  #init(element) {
    const src = element.getAttribute("src");

    if (!src) {
      element.parentElement.removeChild(element);
    } else {
      element.setAttribute("src", this.editor.url(src));
      element.allowFullscreen = true;
      this.editor.dom.wrap(element, TagName.FIGURE, {
        attributes: { class: Iframe.name },
      });
    }
  }
}
