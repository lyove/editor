import Base from "../../../core/Base.js";
import Plugin from "../../../core/Plugin.js";
import { Key, TagGroup, TagName } from "../../../utils/Enum.js";
import i18n from "./i18n.js";

/**
 * Quote Plugin
 */
export default class Quote extends Plugin {
  /**
   * @inheritDoc
   */
  static get name() {
    return "quote";
  }

  /**
   * @inheritDoc
   */
  static get dependencies() {
    return [Base];
  }

  /**
   * @inheritDoc
   */
  init() {
    this._i18n(i18n);
    this._tag({
      name: TagName.Q,
      group: TagGroup.FORMAT,
      command: this.constructor.name,
      attributes: ["class", "data-command"],
    });
    this._command(TagName.Q);
    this._formatbar({
      label: this._("Quote"),
      command: this.constructor.name,
      key: Key.Q,
    });
  }
}
