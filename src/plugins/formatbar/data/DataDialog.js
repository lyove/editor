import Data from "./Data.js";
import Dialog from "../../../modules/dialog/Dialog.js";

/**
 * Data Dialog
 */
export default class DataDialog extends Dialog {
  /**
   * Initializes a new data dialog
   *
   * @param {Editor} editor
   */
  constructor(editor) {
    super(editor, Data.name);
  }

  /**
   * @inheritDoc
   */
  _prepareForm() {
    this.formCreator
      .addLegend(this._("Data"))
      .addTextInput("value", this._("Machine-readable Value"), {
        placeholder: this._("Insert value or leave empty to remove it"),
      });
  }
}
