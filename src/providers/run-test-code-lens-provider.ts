import { CodeLensProvider, CodeLens, TextDocument, Range } from "vscode";
import { name as runTestCommandName } from '../commands/run-test';

// Define the languages and schemes for which the CodeLensProvider should be registered
export const languagesAndSchemes = [
  { language: "javascript", scheme: "file"},
  { language: "typescript", scheme: "file" },
  { language: "glimmer-js", scheme: "file" },
  { language: "glimmer-ts", scheme: "file" },
];

const QUNIT_SYNTAX_REGEX = /module\(['"](.+)['"]|test\(['"](.+)['"]/g;

function walkMatches(text: string, callback: Function) {
    let match;

    while ((match = QUNIT_SYNTAX_REGEX.exec(text))) {
      callback(match);
    }
}

export class RunTestCodeLensProvider implements CodeLensProvider {
  async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    if (document.fileName.match(/-test.(js|ts|gjs|gts)$/) === null) {
      // bail if it is not a test file.
      return [];
    }

    const lenses: CodeLens[] = [];
    let topLevelModuleName = '';
    let nestedModuleName = '';

    walkMatches(document.getText(), (match: RegExpExecArray) => {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      const [_, moduleInvocation, testInvocation] = match;

      if (!topLevelModuleName && moduleInvocation) {
        topLevelModuleName = moduleInvocation;
      } else if (topLevelModuleName && moduleInvocation) {
        nestedModuleName = `${topLevelModuleName} > ${moduleInvocation}`;
      }

      const moduleName = nestedModuleName || topLevelModuleName;
      const testString = testInvocation ? `${moduleName}: ${testInvocation}` : moduleName;

      lenses.push(
        new CodeLens(new Range(startPos, endPos), {
          command: runTestCommandName,
          title: moduleInvocation ? "Run Module" : "Run Test",
          arguments: [testString],
        })
      );

    });

    return lenses;
  }
}
