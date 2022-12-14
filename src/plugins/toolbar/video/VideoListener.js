import Listener from "../../../core/Listener.js";
import Video from "./Video.js";
import { TagName } from "../../../utils/Enum.js";

/**
 * Handles video elements
 */
export default class VideoListener extends Listener {
  /**
   * @inheritDoc
   */
  constructor(editor) {
    super(editor);
    this.editor.textarea.addEventListener("sethtml", this);
    this.editor.textarea.addEventListener("insertvideo", this);
  }

  /**
   * Initializes video elements when editor html is set
   *
   * @param {CustomEvent} event
   * @param {HTMLElement} event.detail.element
   * @return {void}
   */
  sethtml(event) {
    Array.from(event.detail.element.getElementsByTagName(TagName.VIDEO)).forEach((item) =>
      this.#init(item),
    );
  }

  /**
   * Initializes elements
   *
   * @param {CustomEvent} event
   * @param {HTMLVideoElement} event.detail.element
   * @return {void}
   */
  insertvideo(event) {
    this.#init(event.detail.element);
  }

  /**
   * Initializes video element
   *
   * @param {HTMLVideoElement} element
   * @return {void}
   */
  #init(element) {
    const src = element.getAttribute("src");

    if (!src) {
      element.parentElement.removeChild(element);
    } else {
      element.setAttribute("src", this.editor.url(src));
      element.controls = true;
      this.editor.dom.wrap(element, TagName.FIGURE, {
        attributes: { class: Video.name },
      });
    }
  }
}
