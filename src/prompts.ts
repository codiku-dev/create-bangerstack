import { execSync } from "child_process";
import Enquirer from "enquirer";
import ora from "ora";

/** One choice label, or a display name plus distinct value for selects. */
export type ChooseOption = string | { name: string; value: string };

/**
 * Displays a select list and returns the chosen value.
 *
 * @param options - List of choices (strings or { name, value } objects).
 * @param message - Label shown above the list (e.g. "Package manager").
 * @returns The selected value (string).
 */
export async function choose(options: string[], message?: string): Promise<string>;
export async function choose(options: { name: string; value: string }[], message?: string): Promise<string>;
export async function choose(options: ChooseOption[], message = "Choose"): Promise<string> {
  const choices = options.map((opt) => (typeof opt === "string" ? { name: opt, value: opt } : opt));
  const { value } = await Enquirer.prompt<{ value: string }>({
    type: "select",
    name: "value",
    message,
    choices,
    // Enquirer's select stores `choice.name` as the answer, not `choice.value`. Map back so callers
    // receive stable values (e.g. platform "mobile" instead of the long label).
    result: (selectedName: string) => {
      const ch = choices.find((c) => c.name === selectedName);
      if (ch !== undefined && ch.value !== "") return ch.value;
      return selectedName;
    },
  });
  return value;
}

/**
 * Asks a single-choice (radio-style) question with two options.
 *
 * @param message - The question text (e.g. "Install dependencies?").
 * @param defaultValue - Default selected option (true = first choice, false = second).
 * @param yesChoice - Label for the "yes" option (e.g. "Install dependencies").
 * @param noChoice - Label for the "skip" option (e.g. "Skip").
 * @returns true if the first option was selected, false for the second.
 */
export async function confirmSelect(
  message: string,
  defaultValue = true,
  yesChoice = "Yes",
  noChoice = "Skip"
): Promise<boolean> {
  const choices = [
    { name: yesChoice, value: "yes" },
    { name: noChoice, value: "no" },
  ];
  const { value } = await Enquirer.prompt<{ value: string }>({
    type: "select",
    name: "value",
    message,
    choices,
    initial: defaultValue ? 0 : 1,
    // Same as choose(): Enquirer answers with `choice.name`; normalize to yes/no.
    result: (selectedName: string) => {
      const ch = choices.find((c) => c.name === selectedName);
      if (ch !== undefined && ch.value !== "") return ch.value;
      return selectedName;
    },
  });
  return value === "yes";
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
