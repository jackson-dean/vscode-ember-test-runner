import { workspace, commands, Uri } from "vscode";

export const name = "extension.runTest";

function getConfiguredTestPageUrl() {
  return workspace
    .getConfiguration("vscode-ember-test-runner")
    .get("testPageUrl");
}

export const callback = (testString: string, executeCommand: Function = commands.executeCommand, getUrl: Function = getConfiguredTestPageUrl) => {
  const [baseUrl, query = ''] = getUrl().split('?');
  const filterQueryParamKV = `filter=${encodeURIComponent(testString)}`;
  const separator = query.length ? `?${query}&` : '?';
  const urlToOpen = `${baseUrl}${separator}${filterQueryParamKV}`;

  executeCommand("vscode.open", Uri.parse(urlToOpen));
};
