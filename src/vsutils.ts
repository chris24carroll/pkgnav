import { Option, some, none } from "./option";
import { Uri, window, workspace } from "vscode";

// Get the current open workspace folder if it exists
export function workspaceFolder(): Option<Uri> {
  const folders = workspace.workspaceFolders;
  if (folders && folders.length) {
    return some(folders[0].uri);
  } else {
    return none();
  }
}

export function currentWord(): string | undefined {
  const editor = window.activeTextEditor;
  if (editor) {
    const range = editor.document.getWordRangeAtPosition(editor.selection.active);
    if (range) {
      return editor.document.getText(range);
    }
  }
}