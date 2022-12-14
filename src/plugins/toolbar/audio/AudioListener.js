import Listener from "../../../core/Listener.js";
import Audio from "./Audio.js";
import { TagName } from "../../../utils/Enum.js";

/**
 * Handles audio elements
 */
export default class AudioListener extends Listener {
  /**
   * @inheritDoc
   */
  constructor(editor) {
    super(editor);
    this.editor.textarea.addEventListener("sethtml", this);
    this.editor.textarea.addEventListener("insertaudio", this);
  }

  /**
   * Initializes audio elements when editor html is set
   *
   * @param {CustomEvent} event
   * @param {HTMLElement} event.detail.element
   * @return {void}
   */
  sethtml(event) {
    Array.from(event.detail.element.getElementsByTagName(TagName.AUDIO)).forEach((item) =>
      this.#init(item),
    );
  }

  /**
   * Initializes elements
   *
   * @param {CustomEvent} event
   * @param {HTMLAudioElement} event.detail.element
   * @return {void}
   */
  insertaudio(event) {
    this.#init(event.detail.element);
  }

  /**
   * Adds controls and wraps in figure if necessary
   *
   * @param {HTMLAudioElement} element
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
        attributes: { class: Audio.name },
      });
    }
  }
}
