import { window } from 'vscode';
import * as pkgnav from './pkgnav';
import * as dialog from './dialog';
import * as fileutils from './fileutils';
import * as vsutils from './vsutils';

export const allCommands = [
  {
    command: "pkgnav.openFileByModules",
    title: "Open file by modules",
    function: openFileByModules
  },
  {
    command: "pkgnav.openFileByPackages",
    title: "Open file by packages",
    function: openFileByPackages
  },
  {
    command: "pkgnav.openFileByNames",
    title: "Open file by names",
    function: openFileByNames
  },
  {
    command: "pkgnav.openFileInCurrentPackage",
    title: "Open file in the current package",
    function: openFileInCurrentPackage

  },
  {
    command: "pkgnav.openBuildFile",
    title: "Open build file",
    function: openBuildFile
  },
  {
    command: "pkgnav.openResourceFile",
    title: "Open resource file",
    function: openResourceFile
  },
  {
    command: "pkgnav.openOtherFile",
    title: "Open other file",
    function: openOtherFile
  },
  {
    command: "pkgnav.openFileByCurrentWord",
    title: "Open file from cursor",
    function: openFileByCurrentWord
  },
  {
    command: "pkgnav.reload",
    title: "Reload source files",
    function: reload
  },
  {
    command: "pkgnav.showMenu",
    title: "Display Package Navigator Commands",
    function: showMenu
  }
];

export function openFileByNames() {
  dialog.selectItem(pkgnav.allNames()).then(name => {
    selectAndOpenFile(pkgnav.filesForName(name));
  });
}

export function openFileByModules() {
  dialog.selectItem(pkgnav.allModules()).then(mdl => {
    dialog.selectItem(pkgnav.packagesForModule(mdl)).then(pkg => {
      dialog.selectItem(pkgnav.namesForPackage(pkg)).then(name => {
        selectAndOpenFile(pkgnav.filesForModuleAndPackageAndName(mdl, pkg, name));
      });
    });
  });
}

export function openFileByPackages() {
  dialog.selectItem(pkgnav.allPackages()).then(pkg => {
    dialog.selectItem(pkgnav.fileNamesForPackage(pkg)).then(name => {
      selectAndOpenFile(pkgnav.filesForPackageAndName(pkg, name));
    });
  });
}


function selectAndOpenFile(files: Array<string>) {
  if (files.length === 1) {
    fileutils.openFile(files[0]);
  } else {
    dialog.selectFile(files).then(file => {
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
      dialog.selectItem(names).then(name => {
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
