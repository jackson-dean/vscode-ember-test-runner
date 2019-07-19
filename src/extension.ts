import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let timeout: NodeJS.Timer | undefined = undefined;

  const testPageUrl = vscode.workspace
    .getConfiguration("vscode-ember-test-runner")
		.get("testPageUrl");

  // create a decorator type that we use to decorate the text.
  // We are currently not adding any specific decoration, but leaving
  // this here for future example.
  const decorationType = vscode.window.createTextEditorDecorationType({
    // borderWidth: '1px',
    // borderStyle: 'solid',
    // overviewRulerColor: 'blue',
    // overviewRulerLane: vscode.OverviewRulerLane.Right,
    light: {
      // this color will be used in light color themes
      // borderColor: 'darkblue'
    },
    dark: {
      // this color will be used in dark color themes
      // borderColor: '#00ff00'
    }
  });

  let activeEditor = vscode.window.activeTextEditor;

  function updateDecorations() {
    if (!activeEditor) {
      return;
    }

    const regEx = /module\(.+,|test\(.+,/g;
    const text = activeEditor.document.getText();
    const decorationOptions: vscode.DecorationOptions[] = [];
    let match;

    while ((match = regEx.exec(text))) {
      const startPos = activeEditor.document.positionAt(match.index);
      const endPos = activeEditor.document.positionAt(
        match.index + match[0].length
      );
      const testString = match[0]
        .trim()
        .replace(/^module\('?|^test\('?/, "")
        .replace(/'?,/, "");
      const decoration = {
        range: new vscode.Range(startPos, endPos),
        hoverMessage: `[Run Test](${testPageUrl}&filter=${encodeURIComponent(
          testString
        )})`
      };
      decorationOptions.push(decoration);
    }

    activeEditor.setDecorations(decorationType, decorationOptions);
  }

  function triggerUpdateDecorations(editor: vscode.TextEditor) {
    if (editor.document.fileName.match(/-test.(js|ts)$/) === null) {
      return;
    }

    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }

    timeout = setTimeout(updateDecorations, 500);
  }

  if (activeEditor) {
    triggerUpdateDecorations(activeEditor);
  }

  vscode.window.onDidChangeActiveTextEditor(
    editor => {
      activeEditor = editor;
      if (editor) {
        triggerUpdateDecorations(editor);
      }
    },
    null,
    context.subscriptions
  );

  vscode.workspace.onDidChangeTextDocument(
    event => {
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations(activeEditor);
      }
    },
    null,
    context.subscriptions
  );
}
