import { window } from 'vscode';
import * as pkgnav from './pkgnav';
import * as dialog from './dialog';
import * as fileutils from './fileutils';
import * as vsutils from './vsutils';

export const allCommands = [
  {
    command: "pkgnav.openFileByModules",
    title: "Package Navigator: Open file by modules",
    function: openFileByModules
  },
  {
    command: "pkgnav.openFileByPackages",
    title: "Package Navigator: Open file by packages",
    function: openFileByPackages
  },
  {
    command: "pkgnav.openFileByNames",
    title: "Package Navigator: Open file by names",
    function: openFileByNames
  },
  {
    command: "pkgnav.openFileInCurrentPackage",
    title: "Package Navigator: Open file in the current package",
    function: openFileInCurrentPackage

  },
  {
    command: "pkgnav.openBuildFile",
    title: "Package Navigator: Open build file",
    function: openBuildFile
  },
  {
    command: "pkgnav.openResourceFile",
    title: "Package Navigator: Open resource file",
    function: openResourceFile
  },
  {
    command: "pkgnav.openOtherFile",
    title: "Package Navigator: Open other file",
    function: openOtherFile
  },
  {
    command: "pkgnav.openFileByCurrentWord",
    title: "Package Navigator: Open file from cursor",
    function: openFileByCurrentWord
  },
  {
    command: "pkgnav.reload",
    title: "Package Navigator: Reload source files",
    function: reload
  },
  {
    command: "pkgnav.showMenu",
    title: "Package Navigator: Show Commands",
    function: showMenu
  }
];

export function openFileByNames() {
  selectName(pkgnav.allNames()).then(name => {
    selectAndOpenFile(pkgnav.filesForName(name));
  });
}

export function openFileByModules() {
  selectModule(pkgnav.allModules()).then(mdl => {
    selectPackage(pkgnav.packagesForModule(mdl)).then(pkg => {
      selectName(pkgnav.namesForPackage(pkg)).then(name => {
        selectAndOpenFile(pkgnav.filesForModuleAndPackageAndName(mdl, pkg, name));
      });
    });
  });
}

export function openFileByPackages() {
  selectPackage(pkgnav.allPackages()).then(pkg => {
    selectName(pkgnav.namesForPackage(pkg)).then(name => {
      selectAndOpenFile(pkgnav.filesForPackageAndName(pkg, name));
    });
  });
}

function selectPackage(pkgs: Array<string>): Thenable<string> {
  return dialog.selectThing(pkgs, pkg => ("$(package)  " + pkg));
}

function selectModule(modules: Array<string>): Thenable<string> {
  return dialog.selectThing(modules, module => ("$(file-submodule)  " + module));
}

function selectName(names: Array<string>): Thenable<string> {
  return dialog.selectThing(names, name => ("$(symbol-class)  " + name));
}

function selectFile(files: Array<string>): Thenable<string> {
  const root = vsutils.workspaceFolder().map(f => f.path).getOrElse("");

  return dialog.selectThing(files, file => {
    var displayPath;
    if (file.startsWith(root.toString())) {
      displayPath = file.substring(root.length);
      if (displayPath.startsWith("/") || displayPath.startsWith("\\")) {
        displayPath = displayPath.substring(1);
      }
    } else {
      displayPath = file;
    }


    return "$(file)  " + displayPath;
  });
}

function selectAndOpenFile(files: Array<string>) {
  if (files.length === 1) {
    fileutils.openFile(files[0]);
  } else {
    selectFile(files).then(file => {
      fileutils.openFile(file);
    });
  }
}

export function openBuildFile() {
  pkgnav.getBuildFiles().then(selectAndOpenFile);
}

export function openResourceFile() {
  pkgnav.getResourceFiles().then(selectAndOpenFile);
}

export function openOtherFile() {
  pkgnav.getOtherFiles().then(selectAndOpenFile);
}

export function openFileInCurrentPackage() {
  const activeFile = window.activeTextEditor?.document.fileName;
  if (activeFile) {
    const pkg = pkgnav.packageForFile(activeFile);
    if (pkg) {
      const names = pkgnav.namesForPackage(pkg);
      selectName(names).then(name => {
        selectAndOpenFile(pkgnav.filesForPackageAndName(pkg, name));
      });
    }
  }
}

export function openFileByCurrentWord() {
  const word = vsutils.currentWord();
  if (word) {
    const files = pkgnav.filesForName(word);
    if (files.length) {
      selectAndOpenFile(pkgnav.filesForName(word));
    }
  }
}

export function reload() {
  pkgnav.reload();
}

export function showMenu() {
  const commands = allCommands.filter(cmd => cmd.command !== 'pkgnav.showMenu');
  dialog.selectThing(commands, cmd => cmd.title).then(cmd => {
    cmd.function();
  });
}
