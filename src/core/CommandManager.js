import Command from "./Command.js";
import { ErrorMessage } from "../utils/Enum.js";

/**
 * Command Manager
 */
export default class CommandManager {
  /**
   * Registered commands
   *
   * @type {Map<string, Command>}
   */
  #items = new Map();

  /**
   * Initializes a new command manager
   *
   * @param {Command[]} [commands = []]
   */
  constructor(commands = []) {
    commands.forEach((command) => this.set(command));
  }

  /**
   * Returns registered command with given name
   *
   * @param {string} name
   * @return {Command|undefined}
   */
  get(name) {
    return this.#items.get(name);
  }

  /**
   * Adds or updates a command
   *
   * @param {Command} command
   * @return {void}
   */
  set(command) {
    if (!(command instanceof Command)) {
      throw new Error(ErrorMessage.INVALID_ARGUMENT);
    }

    this.#items.set(command.name, command);
  }

  /**
   * Returns registered command for given tag name
   *
   * @param {string} tagName
   * @return {Command|undefined}
   */
  find(tagName) {
    return Array.from(this.#items.values()).find((command) => command.tag?.name === tagName);
  }

  /**
   * Executes command with given name
   *
   * @param {string} name
   * @param {HTMLElement} triggerElement
   * @return {void}
   */
  execute(name, triggerElement) {
    this.get(name)?.execute(name, triggerElement);
  }

  /**
   * Freezes itself and its items
   */
  freeze() {
    this.#items.forEach((command) => Object.freeze(command));
    Object.freeze(this.#items);
    Object.freeze(this);
  }
}
