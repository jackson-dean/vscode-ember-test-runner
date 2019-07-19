# VSCode Ember Test Runner
Run ember qunit tests filtered by module or specific test from within vscode.

## Features
After installing, there should be a small hover card with the text "Run Test"
displayed when hovering over a test module or individual test invocation. 
Clicking the text should open the test runner in chrome pre-filtered to the 
desired test string. 

## Requirements
Make sure the tests are being served by running `ember test --serve` in the
root of the project.

## Extension Settings
This extension contributes the following settings:

* `vscode-ember-test-runner.testPageUrl`: set this to the url that should be used
when running tests. By default it is set to: "https://localhost:4444?hidepassed"
