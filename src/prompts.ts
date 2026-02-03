import { execSync } from "child_process";
import Enquirer from "enquirer";
import ora from "ora";

/**
 * Displays a select list and returns the chosen value.
 *
 * @param options - List of choices (strings or { name, value } objects).
 * @param message - Label shown above the list (e.g. "Package manager").
 * @returns The selected value (string).
 */
export async function choose(options: string[], message = "Choose"): Promise<string> {
  const choices = options.map((opt) => (typeof opt === "string" ? { name: opt, value: opt } : opt));
  const { value } = await Enquirer.prompt<{ value: string }>({
    type: "select",
    name: "value",
    message,
    choices,
  });
  return value;
}

/**
 * Asks a yes/no question.
 *
 * @param message - The question text (e.g. "Install dependencies?").
 * @param defaultValue - Default answer when user presses Enter (true = Yes, false = No).
 * @returns true for Yes, false for No.
 */
export async function confirm(message: string, defaultValue = true): Promise<boolean> {
  const { value } = await Enquirer.prompt<{ value: boolean }>({
    type: "confirm",
    name: "value",
    message,
    initial: defaultValue,
  });
  return value;
}

/**
 * Asks for a single-line text input.
 *
 * @param message - Label for the input (e.g. "Project name").
 * @param initial - Pre-filled value / placeholder when the prompt is shown.
 * @returns The string entered by the user, or "" if empty.
 */
export async function input(message: string, initial = ""): Promise<string> {
  const { value } = await Enquirer.prompt<{ value: string }>({
    type: "input",
    name: "value",
    message,
    initial: initial || undefined,
  });
  return value ?? "";
}

/**
 * Runs a command with a spinner; on success the spinner turns to a checkmark, on error it fails and throws.
 *
 * @param title - Text shown next to the spinner (e.g. "Cloning template…").
 * @param command - Full shell command to run.
 * @param cwd - Optional working directory for the command.
 */
export function spin(title: string, command: string, cwd?: string): void {
  const spinner = ora(title).start();
  try {
    execSync(command, { stdio: "pipe", shell: true, cwd } as unknown as import("child_process").ExecSyncOptions);
    spinner.succeed();
  } catch (err) {
    spinner.fail();
    throw err;
  }
}

/**
 * Prints a styled title line (green, bold) to the console.
 *
 * @param text - The title to display (e.g. "create-bangerstack", "Starting dev server…").
 */
export function style(text: string): void {
  console.log("\n\u001b[1m\u001b[32m" + text + "\u001b[0m\n");
}
