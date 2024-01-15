import * as vscode from "vscode";
import * as runTestCodeLens from "./providers/run-test-code-lens-provider";
import * as runTest from "./commands/run-test";

export function activate(context: vscode.ExtensionContext) {
  // Register the runTest command
  const runTestCommand = vscode.commands.registerCommand(runTest.name, runTest.callback);
  context.subscriptions.push(runTestCommand);

  // Register CodeLensProvider for each language and scheme
  runTestCodeLens.languagesAndSchemes.forEach(({ language, scheme }) => {
    const codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(
      { language, scheme },
      new runTestCodeLens.RunTestCodeLensProvider()
    );
    context.subscriptions.push(codeLensProviderDisposable);
  });
}
