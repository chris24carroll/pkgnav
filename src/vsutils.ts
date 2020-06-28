import { Option, some, none } from "./option";
import { Uri, workspace } from "vscode";

// Get the current open workspace folder if it exists
export function workspaceFolder(): Option<Uri> {
  const folders = workspace.workspaceFolders;
  if (folders && folders.length) {
    return some(folders[0].uri);
  } else {
    return none();
  }
}