import { workspace, commands, Uri } from "vscode";

export const name = "extension.runTest";

export const callback = (testString: string) => {
  const testPageUrl = workspace
    .getConfiguration("vscode-ember-test-runner")
    .get("testPageUrl");

  commands.executeCommand(
    "vscode.open",
    Uri.parse(`${testPageUrl}&filter=${encodeURIComponent(testString)}`)
  );
};
