import * as assert from 'assert';
import { workspace, TextDocument } from 'vscode';
import { RunTestCodeLensProvider } from '../../../providers/run-test-code-lens-provider';


suite('RunTestCodeLensProvider', () => {
  test('it returns empty codelenses array when none are found', async () => {
    const textDocument = await workspace.openTextDocument({
      language: 'javascript',
      content: '',
    });

    const provider = new RunTestCodeLensProvider();
    const lenses = await provider.provideCodeLenses(textDocument);
    assert.strictEqual(lenses.length, 0);
  });

  test('it returns the expected codelenses for a test tile with a ts extension', async () => {
    const textDocument = await workspace.openTextDocument({
      language: 'typescript',
      content: `import { module, test } from 'qunit';

module('Unit | Utility | test-util', function() {
  test('it does the thing', function(assert) {
    assert.ok(true);
  });
});`,
    });

    const doc: TextDocument = {
      ...textDocument,
      fileName: 'dummy-test.ts',
    };

    const provider = new RunTestCodeLensProvider();
    const lenses = await provider.provideCodeLenses(doc);
    const parsedLenses = JSON.parse(JSON.stringify(lenses));
    console.log(JSON.stringify(lenses))

    assert.deepStrictEqual(
      parsedLenses,
      [
        {
          "range": [
            {
              "line": 2,
              "character": 0
            },
            {
              "line": 2,
              "character": 35
            }
          ],
          "command": {
            "command": "extension.runTest",
            "title": "Run Module",
            "arguments": [
              "Unit | Utility | test-util"
            ]
          }
        },
        {
          "range": [
            {
              "line": 3,
              "character": 2
            },
            {
              "line": 3,
              "character": 26
            }
          ],
          "command": {
            "command": "extension.runTest",
            "title": "Run Test",
            "arguments": [
              "Unit | Utility | test-util: it does the thing"
            ]
          }
        }
      ],
    );
  });


  test('it returns the expected codelenses for a test tile with a gts extension', async () => {
    const textDocument = await workspace.openTextDocument({
      language: 'glint-ts',
      content: `import { module, test } from 'qunit';

module('Unit | Utility | test-util', function() {
  test('it does the thing', function(assert) {
    assert.ok(true);
  });
});`,
    });

    const doc: TextDocument = {
      ...textDocument,
      fileName: 'dummy-test.gts',
    };

    const provider = new RunTestCodeLensProvider();
    const lenses = await provider.provideCodeLenses(doc);
    const parsedLenses = JSON.parse(JSON.stringify(lenses));
    console.log(JSON.stringify(lenses))

    assert.deepStrictEqual(
      parsedLenses,
      [
        {
          "range": [
            {
              "line": 2,
              "character": 0
            },
            {
              "line": 2,
              "character": 35
            }
          ],
          "command": {
            "command": "extension.runTest",
            "title": "Run Module",
            "arguments": [
              "Unit | Utility | test-util"
            ]
          }
        },
        {
          "range": [
            {
              "line": 3,
              "character": 2
            },
            {
              "line": 3,
              "character": 26
            }
          ],
          "command": {
            "command": "extension.runTest",
            "title": "Run Test",
            "arguments": [
              "Unit | Utility | test-util: it does the thing"
            ]
          }
        }
      ],
    );
  });

  test('it returns the expected codelenses for a test tile with a gjs extension', async () => {
    const textDocument = await workspace.openTextDocument({
      language: 'glint-js',
      content: `import { module, test } from 'qunit';

module('Unit | Utility | test-util', function() {
  test('it does the thing', function(assert) {
    assert.ok(true);
  });
});`,
    });

    const doc: TextDocument = {
      ...textDocument,
      fileName: 'dummy-test.gjs',
    };

    const provider = new RunTestCodeLensProvider();
    const lenses = await provider.provideCodeLenses(doc);
    const parsedLenses = JSON.parse(JSON.stringify(lenses));
    console.log(JSON.stringify(lenses))

    assert.deepStrictEqual(
      parsedLenses,
      [
        {
          "range": [
            {
              "line": 2,
              "character": 0
            },
            {
              "line": 2,
              "character": 35
            }
          ],
          "command": {
            "command": "extension.runTest",
            "title": "Run Module",
            "arguments": [
              "Unit | Utility | test-util"
            ]
          }
        },
        {
          "range": [
            {
              "line": 3,
              "character": 2
            },
            {
              "line": 3,
              "character": 26
            }
          ],
          "command": {
            "command": "extension.runTest",
            "title": "Run Test",
            "arguments": [
              "Unit | Utility | test-util: it does the thing"
            ]
          }
        }
      ],
    );
  });

  test('it returns the expected codelenses when there are nested modules', async () => {
    const textDocument = await workspace.openTextDocument({
      language: 'javascript',
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
    const parsedLenses = JSON.parse(JSON.stringify(lenses));
    assert.deepStrictEqual(
      parsedLenses, 
      [
        {
          "range": [
            {
              "line": 2,
              "character": 0
            },
            {
              "line": 2,
              "character": 35
            }
          ],
          "command": {
            "command": "extension.runTest",
            "title": "Run Module",
            "arguments": [
              "Unit | Utility | test-util"
            ]
          }
        },
        {
          "range": [
            {
              "line": 3,
              "character": 2
            },
            {
              "line": 3,
              "character": 26
            }
          ],
          "command": {
            "command": "extension.runTest",
            "title": "Run Test",
            "arguments": [
              "Unit | Utility | test-util: it does the thing"
            ]
          }
        },
        {
          "range": [
            {
              "line": 7,
              "character": 2
            },
            {
              "line": 7,
              "character": 18
            }
          ],
          "command": {
            "command": "extension.runTest",
            "title": "Run Module",
            "arguments": [
              "Unit | Utility | test-util > helper1"
            ]
          }
        },
        {
          "range": [
            {
              "line": 8,
              "character": 4
            },
            {
              "line": 8,
              "character": 28
            }
          ],
          "command": {
            "command": "extension.runTest",
            "title": "Run Test",
            "arguments": [
              "Unit | Utility | test-util > helper1: it does the thing"
            ]
          }
        },
        {
          "range": [
            {
              "line": 13,
              "character": 2
            },
            {
              "line": 13,
              "character": 18
            }
          ],
          "command": {
            "command": "extension.runTest",
            "title": "Run Module",
            "arguments": [
              "Unit | Utility | test-util > helper3"
            ]
          }
        },
        {
          "range": [
            {
              "line": 14,
              "character": 4
            },
            {
              "line": 14,
              "character": 28
            }
          ],
          "command": {
            "command": "extension.runTest",
            "title": "Run Test",
            "arguments": [
              "Unit | Utility | test-util > helper3: it does the thing"
            ]
          }
        },
        {
          "range": [
            {
              "line": 19,
              "character": 2
            },
            {
              "line": 19,
              "character": 18
            }
          ],
          "command": {
            "command": "extension.runTest",
            "title": "Run Module",
            "arguments": [
              "Unit | Utility | test-util > helper3"
            ]
          }
        },
        {
          "range": [
            {
              "line": 20,
              "character": 4
            },
            {
              "line": 20,
              "character": 28
            }
          ],
          "command": {
            "command": "extension.runTest",
            "title": "Run Test",
            "arguments": [
              "Unit | Utility | test-util > helper3: it does the thing"
            ]
          }
        }
      ]
    );
  });
});

