import Plugin from "../../../core/Plugin.js";
import Base from "../../../core/Base.js";
import DetailsFilter from "./DetailsFilter.js";
import DetailsListener from "./DetailsListener.js";
import { TagGroup, TagName } from "../../../utils/Enum.js";
import i18n from "./i18n.js";

/**
 * Details Plugin
 */
export default class Details extends Plugin {
  /**
   * @inheritDoc
   */
  static get name() {
    return "details";
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
      name: TagName.DETAILS,
      group: TagGroup.CONTAINER,
      command: this.constructor.name,
      attributes: ["class", "data-command"],
      children: [
        TagGroup.AUDIO,
        TagGroup.FIGURE,
        TagGroup.IFRAME,
        TagGroup.IMAGE,
        TagGroup.LIST,
        TagGroup.PARAGRAPH,
        TagGroup.PREFORMAT,
        TagGroup.QUOTE,
        TagGroup.RULE,
        TagGroup.SUMMARY,
        TagGroup.TABLE,
        TagGroup.VIDEO,
      ],
      arbitrary: true,
      deletable: true,
      focusable: true,
      navigable: true,
      slotable: true,
      sortable: true,
    });
    this._tag({
      name: TagName.SUMMARY,
      group: TagGroup.SUMMARY,
      editable: true,
      navigable: true,
      enter: TagName.P,
    });
    new DetailsListener(this.editor);
    this._command(TagName.DETAILS);
    this._toolbar({
      label: this._("Details"),
      command: this.constructor.name,
    });
    this.editor.filters.add(new DetailsFilter(this.editor));
  }
}
