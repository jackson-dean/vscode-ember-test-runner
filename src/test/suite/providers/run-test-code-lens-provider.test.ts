import * as assert from 'assert';
import { workspace, TextDocument } from 'vscode';
import { RunTestCodeLensProvider } from '../../../providers/run-test-code-lens-provider';


suite('RunTestCodeLensProvider', () => {
  test('it returns empty codelenses array when none are found', async () => {
    const textDocument = await workspace.openTextDocument({
      language: 'js',
      content: '',
    });

    const provider = new RunTestCodeLensProvider();
    const lenses = await provider.provideCodeLenses(textDocument);
    assert.equal(lenses.length, 0);
  });

  test('it returns the expected codelenses when there are nested modules', async () => {
    const textDocument = await workspace.openTextDocument({
      language: 'js',
      content: `import { module, test } from 'qunit';

module('Unit | Utility | test-util', function() {
  test('it does the thing', function(assert) {
    assert.ok(true);
  });

  module('helper1', function() {
    test('it does the thing', function(assert) {
      assert.ok(true);
    });
  });

  module('helper3', function() {
    test('it does the thing', function(assert) {
      assert.ok(true);
    });
  });

  module('helper3', function() {
    test('it does the thing', function(assert) {
      assert.ok(true);
    });
  });
});`,
    });

    const doc: TextDocument = {
      ...textDocument,
      fileName: 'dummy-test.js',
    };

    const provider = new RunTestCodeLensProvider();
    const lenses = await provider.provideCodeLenses(doc);
    assert.deepEqual(lenses, [
      {
        "command": {
          "arguments": [
            "Unit | Utility | test-util"
          ],
          "command": "extension.runTest",
          "title": "Run Module",
        },
        "range": {
          "_end": {
            "_character": 35,
            "_line": 2,
          },
          "_start": {
            "_character": 0,
            "_line": 2,
          },
        },
      },
      {
        "command": {
          "arguments": [
            "Unit | Utility | test-util: it does the thing"
          ],
          "command": "extension.runTest",
          "title": "Run Test"
        },
        "range": {
          "_end": {
            "_character": 26,
            "_line": 3,
          },
          "_start": {
            "_character": 2,
            "_line": 3,
          },
        },
      },
      {
        "command": {
          "arguments": [
            "Unit | Utility | test-util > helper1"
          ],
          "command": "extension.runTest",
          "title": "Run Module",
        },
        "range": {
          "_end": {
            "_character": 18,
            "_line": 7,
          },
          "_start": {
            "_character": 2,
            "_line": 7,
          },
        },
      },
      {
        "command": {
          "arguments": [
            "Unit | Utility | test-util > helper1: it does the thing"
          ],
          "command": "extension.runTest",
          "title": "Run Test",
        },
        "range": {
          "_end": {
            "_character": 28,
            "_line": 8,
          },
          "_start": {
            "_character": 4,
            "_line": 8,
          },
        },
      },
      {
        "command": {
          "arguments": [
            "Unit | Utility | test-util > helper3"
          ],
          "command": "extension.runTest",
          "title": "Run Module",
        },
        "range": {
          "_end": {
            "_character": 18,
            "_line": 13,
          },
          "_start": {
            "_character": 2,
            "_line": 13,
          },
        },
      },
      {
        "command": {
          "arguments": [
            "Unit | Utility | test-util > helper3: it does the thing"
          ],
          "command": "extension.runTest",
          "title": "Run Test",
        },
        "range": {
          "_end": {
            "_character": 28,
            "_line": 14,
          },
          "_start": {
            "_character": 4,
            "_line": 14,
          },
        },
      },
      {
        "command": {
          "arguments": [
            "Unit | Utility | test-util > helper3"
          ],
          "command": "extension.runTest",
          "title": "Run Module",
        },
        "range": {
          "_end": {
            "_character": 18,
            "_line": 19,
          },
          "_start": {
            "_character": 2,
            "_line": 19,
          },
        },
      },
      {
        "command": {
          "arguments": [
            "Unit | Utility | test-util > helper3: it does the thing"
          ],
          "command": "extension.runTest",
          "title": "Run Test",
        },
        "range": {
          "_end": {
            "_character": 28,
            "_line": 20,
          },
          "_start": {
            "_character": 4,
            "_line": 20,
          }
        }
      }
    ]
    );
  });
});

