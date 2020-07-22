import { window, workspace } from 'vscode';
import * as vsutils from './vsutils';

export function message(msg: string) {
  window.showInformationMessage(msg);
}

export function selectItem(items: Array<string>): Thenable<string> {
  return new Promise((resolve, reject) => {

    if (items.length) {
      const quickPick = window.createQuickPick();
      quickPick.items = items.map(i => ({ label: i }));
      quickPick.onDidChangeSelection(selection => {
        quickPick.hide();

        if (selection[0]) {
          resolve(selection[0].label);
        } else {
          reject();
        }
      });
      quickPick.onDidHide(() => quickPick.dispose());
      quickPick.show();
    } else {
      message("Package Navigator: Nothing found");
      reject();
    }
  });
}

export function selectThing<A>(things: Array<A>, label: (thing: A) => string): Thenable<A> {
  return new Promise((resolve, reject) => {
    selectItem(things.map(label)).then(selected => {
      const thing = things.find(thing => label(thing) === selected);
      if (thing) {
        resolve(thing);
      } else {
        reject();
      }
    });
  });
}

export function selectFile(files: Array<string>): Thenable<string> {
  return vsutils.workspaceFolder().fold<Thenable<string>>(
    () => new Promise((resolve, reject) => {
      reject();
    }),
    rootUri => {
      const root = rootUri.path;
      const label = (path: string) => {
        if (root) {
          if (path.startsWith(root)) {
            path = path.substring(root.length);
            if (path.startsWith("/")) {
              path = path.substring(1);
            }
          }
        }
        return path;
      };
      return selectThing(files, label);
    }
  );
}