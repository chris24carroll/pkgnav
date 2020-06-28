import { window } from 'vscode';
import * as pkgnav from './pkgnav';
import * as dialog from './dialog';
import * as fileutils from './fileutils';
import * as vsutils from './vsutils';


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

export function reload() {
  pkgnav.reload();
}