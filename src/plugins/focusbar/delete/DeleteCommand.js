import Command from "../../../core/Command.js";
import Delete from "./Delete.js";

/**
 * Delete Command
 */
export default class DeleteCommand extends Command {
  /**
   * Initializes a new delete command
   *
   * @param {Editor} editor
   */
  constructor(editor) {
    super(editor, Delete.name);
  }

  /**
   * @inheritDoc
   */
  execute() {
    const element = this.editor.dom.getActiveElement();

    if (element?.hasAttribute("data-deletable")) {
      this.editor.dom.delete(element);
    }
  }
}
