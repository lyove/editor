import Dialog from "../../../modules/dialog/Dialog.js";
import Section from "./Section.js";

/**
 * Section Dialog
 */
export default class SectionDialog extends Dialog {
  /**
   * Initializes a new div dialog
   *
   * @param {Editor} editor
   */
  constructor(editor) {
    super(editor, Section.name);
  }

  /**
   * @inheritDoc
   */
  _prepareForm() {
    this.formCreator.addLegend(this._("Section")).addTextInput("class", this._("CSS class"), {
      placeholder: this._("Insert CSS class"),
    });
  }
}
