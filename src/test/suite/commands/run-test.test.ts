import * as assert from 'assert';
import * as runTest from '../../../commands/run-test';
import { Uri } from "vscode";


suite('runTestCommand', () => {
	test('it calls the open command with the configured default url', () => {
    const expectedTestString = 'my test string';
    const expectedUrl = Uri.parse(`http://localhost:7357/tests/index.html?hidepassed&filter=${encodeURIComponent(expectedTestString)}`);

    runTest.callback(expectedTestString, (vscodeOperation: string, url: string) => {
      assert.equal(vscodeOperation, 'vscode.open', 'The expected operation was used');
      assert.equal(url.toString(), expectedUrl.toString(), 'The expected url was created');
    });
  });

	test('it calls the open command with the expected url when the url does not have existing query params', () => {
    const getUrl = () => 'http://localhost:7357/tests/index.html';
    const expectedTestString = 'my test string';
    const expectedUrl = Uri.parse(`http://localhost:7357/tests/index.html?filter=${encodeURIComponent(expectedTestString)}`);

    runTest.callback(expectedTestString, (vscodeOperation: string, url: string) => {
      assert.equal(vscodeOperation, 'vscode.open', 'The expected operation was used');
      assert.equal(url.toString(), expectedUrl, 'The expected url was created');
    }, getUrl);
  });

	test('it calls the open command with the expected url when the url has existing query params', () => {
    const getUrl = () => 'http://localhost:7357/tests/index.html?hidepassed';
    const expectedTestString = 'my test string';
    const expectedUrl = Uri.parse(`http://localhost:7357/tests/index.html?hidepassed&filter=${encodeURIComponent(expectedTestString)}`);

    runTest.callback(expectedTestString, (vscodeOperation: string, url: string) => {
      assert.equal(vscodeOperation, 'vscode.open', 'The expected operation was used');
      assert.equal(url.toString(), expectedUrl, 'The expected url was created');
    }, getUrl);
	});
});
