import * as vscode from "vscode";
import * as runTestCodeLens from "./providers/run-test-code-lens-provider";
import * as runTest from "./commands/run-test";

export function activate(context: vscode.ExtensionContext) {
  const runTestCommand = vscode.commands.registerCommand(
    runTest.name,
    runTest.callback
  );
  let codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(
    runTestCodeLens.docSelector,
    new runTestCodeLens.RunTestCodeLensProvider()
  );

  context.subscriptions.push(codeLensProviderDisposable, runTestCommand);
}
