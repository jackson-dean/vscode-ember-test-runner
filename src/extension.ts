import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const runTest = vscode.commands.registerCommand(
    "extension.runTest",
    testString => {
      const testPageUrl = vscode.workspace
        .getConfiguration("vscode-ember-test-runner")
        .get("testPageUrl");

      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(
          `${testPageUrl}&filter=${encodeURIComponent(testString)}`
        )
      );
    }
  );

  class MyCodeLensProvider implements vscode.CodeLensProvider {
    async provideCodeLenses(
      document: vscode.TextDocument
    ): Promise<vscode.CodeLens[]> {
      if (document.fileName.match(/-test.(js|ts)$/) === null) {
        // bail if it is not a test file.
        return [];
      }

      let lenses = [];
      const text = document.getText();
      const regEx = /module\(.+,|test\(.+,/g;
      let match;
      while ((match = regEx.exec(text))) {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        const testString = match[0]
          .trim()
          .replace(/^module\('?|^test\('?/, "")
          .replace(/'?,/, "");

        lenses.push(
          new vscode.CodeLens(
            new vscode.Range(
              new vscode.Position(startPos.line, startPos.character),
              new vscode.Position(endPos.line, endPos.character)
            ),
            {
              command: "extension.runTest",
              title: "Run Test",
              arguments: [testString]
            }
          )
        );
      }

      return lenses;
    }
  }

  let codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(
    {
      language: "javascript",
      scheme: "file"
    },
    new MyCodeLensProvider()
  );

  context.subscriptions.push(codeLensProviderDisposable, runTest);
}
