import Listener from "../../../core/Listener.js";
import { Key, TagName } from "../../../utils/Enum.js";
import { isKey } from "../../../utils/util.js";

/**
 * Table Listener
 */
export default class TableListener extends Listener {
  /**
   * @inheritDoc
   */
  constructor(editor) {
    super(editor);
    this.editor.textarea.addEventListener("inserttable", this);
    this.editor.textarea.addEventListener("inserttd", this);
    this.editor.textarea.addEventListener("insertth", this);
  }

  /**
   * Initializes table elements
   *
   * @param {CustomEvent} event
   * @param {HTMLTableElement} event.detail.element
   * @return {void}
   */
  inserttable(event) {
    if (
      event.detail.element.tBodies.length > 0 &&
      event.detail.element.tBodies[0].rows[0] &&
      (!event.detail.element.tHead || !event.detail.element.tFoot)
    ) {
      if (!event.detail.element.tHead) {
        this.#row(
          event.detail.element.createTHead(),
          event.detail.element.tBodies[0].rows[0].cells.length,
        );
      }

      if (!event.detail.element.tFoot) {
        this.#row(
          event.detail.element.createTFoot(),
          event.detail.element.tBodies[0].rows[0].cells.length,
        );
      }
    }
  }

  /**
   * Initializes table cell elements
   *
   * @param {CustomEvent} event
   * @param {HTMLTableCellElement} event.detail.element
   * @return {void}
   */
  inserttd(event) {
    event.detail.element.addEventListener("keydown", this);
  }

  /**
   * Initializes table cell elements
   *
   * @param {CustomEvent} event
   * @param {HTMLTableHeaderCellElement} event.detail.element
   * @return {void}
   */
  insertth(event) {
    event.detail.element.addEventListener("keydown", this);
  }

  /**
   * Handles key combinations for sorting
   *
   * @param {KeyboardEvent} event
   * @param {HTMLTableCellElement} event.target
   * @return {void}
   */
  keydown(event) {
    const cell = event.target;
    const row = cell.parentElement;
    const base = row.parentElement;
    const table = base instanceof HTMLTableElement ? base : base.parentElement;
    const keys = [Key.LEFT, Key.RIGHT, Key.UP, Key.DOWN];
    const isNav = isKey(event, keys);
    const isSort = isKey(event, keys, { ctrl: true });
    const isAdd = isKey(event, keys, { alt: true });
    const isDel = isKey(event, keys, { alt: true, shift: true });

    if (
      cell instanceof HTMLTableCellElement &&
      row instanceof HTMLTableRowElement &&
      (base instanceof HTMLTableElement || base instanceof HTMLTableSectionElement) &&
      table instanceof HTMLTableElement &&
      ((isNav && this.#enabled(cell, event.key)) || isSort || isAdd || isDel)
    ) {
      const cellIndex = cell.cellIndex;
      const cellLength = row.cells.length;
      const rowLength = base.rows.length;
      const rowIndex = base instanceof HTMLTableElement ? row.rowIndex : row.sectionRowIndex;
      const isFirst = cellIndex === 0;
      const isLast = cellIndex === cellLength - 1;
      const isFirstRow = rowIndex === 0;
      const isLastRow = rowIndex === rowLength - 1;
      const isFirstTableRow = row.rowIndex === 0;
      const isLastTableRow = row.rowIndex === table.rows.length - 1;

      event.preventDefault();
      event.stopPropagation();

      if (isNav) {
        if (event.key === Key.LEFT && !isFirst) {
          this.editor.dom.focusEnd(row.cells[cellIndex - 1]);
        } else if (event.key === Key.LEFT && isFirstTableRow) {
          this.editor.dom.focusEnd(table.rows[table.rows.length - 1].cells[cellLength - 1]);
        } else if (event.key === Key.LEFT) {
          this.editor.dom.focusEnd(table.rows[row.rowIndex - 1].cells[cellLength - 1]);
        } else if (event.key === Key.RIGHT && !isLast) {
          row.cells[cellIndex + 1].focus();
        } else if (event.key === Key.RIGHT && isLastTableRow) {
          table.rows[0].cells[0].focus();
        } else if (event.key === Key.RIGHT) {
          table.rows[row.rowIndex + 1].cells[0].focus();
        } else if (event.key === Key.UP && isFirstTableRow) {
          table.rows[table.rows.length - 1].cells[cellIndex].focus();
        } else if (event.key === Key.UP) {
          table.rows[row.rowIndex - 1].cells[cellIndex].focus();
        } else if (event.key === Key.DOWN && isLastTableRow) {
          table.rows[0].cells[cellIndex].focus();
        } else if (event.key === Key.DOWN) {
          table.rows[row.rowIndex + 1].cells[cellIndex].focus();
        }
      } else if (isSort) {
        if (event.key === Key.LEFT && cellLength > 1 && isFirst) {
          Array.from(table.rows).forEach((item) => item.appendChild(item.cells[cellIndex]));
        } else if (event.key === Key.LEFT && cellLength > 1) {
          Array.from(table.rows).forEach((item) =>
            item.insertBefore(item.cells[cellIndex], item.cells[cellIndex - 1]),
          );
        } else if (event.key === Key.RIGHT && cellLength > 1 && isLast) {
          Array.from(table.rows).forEach((item) =>
            item.insertBefore(item.cells[cellIndex], item.cells[0]),
          );
        } else if (event.key === Key.RIGHT && cellLength > 1) {
          Array.from(table.rows).forEach((item) =>
            item.insertBefore(item.cells[cellIndex + 1], item.cells[cellIndex]),
          );
        } else if (event.key === Key.UP && rowLength > 1 && isFirstRow) {
          base.appendChild(row);
        } else if (event.key === Key.UP && rowLength > 1) {
          base.insertBefore(row, base.rows[rowIndex - 1]);
        } else if (event.key === Key.DOWN && rowLength > 1 && isLastRow) {
          base.insertBefore(row, base.rows[0]);
        } else if (event.key === Key.DOWN && rowLength > 1) {
          base.insertBefore(base.rows[rowIndex + 1], row);
        }

        cell.focus();
      } else if (isAdd) {
        if (event.key === Key.LEFT) {
          Array.from(table.rows).forEach((item) => this.#cell(item, item.cells[cellIndex]));
        } else if (event.key === Key.RIGHT) {
          Array.from(table.rows).forEach((item) => this.#cell(item, item.cells[cellIndex + 1]));
        } else if (event.key === Key.UP) {
          this.#row(base, cellLength, rowIndex);
        } else if (event.key === Key.DOWN) {
          this.#row(base, cellLength, rowIndex + 1);
        }
      } else if (isDel) {
        if (event.key === Key.LEFT && !isFirst) {
          Array.from(table.rows).forEach((item) => item.deleteCell(cellIndex - 1));
        } else if (event.key === Key.RIGHT && !isLast) {
          Array.from(table.rows).forEach((item) => item.deleteCell(cellIndex + 1));
        } else if (event.key === Key.UP && rowIndex > 0) {
          base.deleteRow(rowIndex - 1);
        } else if (event.key === Key.DOWN && rowIndex < rowLength - 1) {
          base.deleteRow(rowIndex + 1);
        }
      }
    }
  }

  /**
   * Creates table row
   *
   * @param {HTMLTableElement|HTMLTableSectionElement} element
   * @param {number} length
   * @param {number} [index = 0]
   * @return {void}
   */
  #row(element, length, index = 0) {
    const row = element.insertRow(index);

    for (let i = 0; i < length; i++) {
      this.#cell(row);
    }
  }

  /**
   * Creates table cell
   *
   * @param {HTMLTableRowElement} element
   * @param {?HTMLTableCellElement} [ref = null]
   * @return {void}
   */
  #cell(element, ref = null) {
    const name = element.parentElement.localName === TagName.THEAD ? TagName.TH : TagName.TD;
    element.insertBefore(this.editor.dom.createElement(name), ref);
  }

  /**
   * Enables or disables navigation for table cell elements
   *
   * @param {HTMLElement} element
   * @param {string} key
   * @return {boolean}
   */
  #enabled(element, key) {
    if ([Key.UP, Key.DOWN].includes(key)) {
      return true;
    }

    const sel = this.editor.dom.getSelection();
    const anc = sel.anchorNode instanceof HTMLElement ? sel.anchorNode : element;

    if (!sel.isCollapsed) {
      return false;
    }

    if (key === Key.LEFT) {
      let first = element.firstChild;

      if (first instanceof HTMLElement) {
        first = first.firstChild;
      }

      return sel.anchorOffset === 0 && [element, first].includes(anc);
    }

    let last = element.lastChild;

    if (element.lastChild instanceof HTMLBRElement && element.lastChild.previousSibling) {
      last = element.lastChild.previousSibling;
    }

    if (last instanceof HTMLElement) {
      last = last.lastChild;
    }

    return sel.anchorOffset === anc.textContent.length && [element, last].includes(anc);
  }
}
