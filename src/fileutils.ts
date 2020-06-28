import { workspace, window, Uri } from "vscode";
import { option, none, Option, some } from './option';
import * as utils from './utils';
import * as vsutils from './vsutils';

export interface FileInfo {
  name: string;
  package: string;
  module: string;
  subRoot: string;
  extension: string;
}

function filePackage(path: string, pkgSep: string) {
  let path2;
  if (path.startsWith("/")) {
    path2 = path.substring(1);
  } else {
    path2 = path;
  }

  const index = path2.lastIndexOf("/");
  if (index < 0) {
    return "<root>";
  } else {
    return path2.substring(0, index).replace(/\//g, pkgSep);
  }
}

function module(path: string, subRoot: string): Option<string> {
  const index = path.indexOf(subRoot);
  if (index < 0) {
    return none<string>();
  } else {
    let m = path.substring(0, index);
    if (m.startsWith("/")) {
      m = m.substring(1);
    }
    if (m.endsWith("/")) {
      m = m.substring(0, m.length - 1);
    }
    return option(m).filter(x => x.length > 0);
  }
}

function fileNameAndExtension(path: string) {
  const index = path.lastIndexOf("/");
  let nameAndExt;
  if (index < 0) {
    nameAndExt = path;
  } else {
    nameAndExt = path.substring(index + 1);
  }
  const extIndex = nameAndExt.lastIndexOf(".");
  if (extIndex < 0) {
    return [nameAndExt, ""];
  } else {
    return [nameAndExt.substring(0, extIndex), nameAndExt.substring(extIndex)];
  }
}


export function fileInfo(root: string, subRoot: string, file: String, pkgSep: string) {
  return option(file)
    .filter(p => p.startsWith(root))
    .map(p => { return p.substring(root.length); })
    .flatMap(p => {
      const index = p.indexOf(subRoot);
      if (index < 0) {
        return none<FileInfo>();
      } else {
        const filePath = p.substring(index + subRoot.length);
        const nameAndExt = fileNameAndExtension(filePath);
        return some({
          name: nameAndExt[0],
          extension: nameAndExt[1],
          package: filePackage(filePath, pkgSep),
          module: module(p, subRoot).getOrElse("<root>"),
          subRoot: subRoot,
        });
      }
    });
}

export function openFile(file: string) {
  workspace.openTextDocument(Uri.file(file)).then(doc => {
    window.showTextDocument(doc);
  });
}

export function filePathFromFileInfo(fi: FileInfo, pkgSep: string): Option<string> {
  return vsutils.workspaceFolder().map(uri => uri.path).map(root => {
    let modulePath;
    if (fi.module === "<root>") {
      modulePath = "";
    } else {
      modulePath = fi.module;
    }
    return concatFilePaths(
      root,
      concatFilePaths(
        modulePath,
        concatFilePaths(
          fi.subRoot,
          concatFilePaths(
            utils.replaceAll(fi.package, pkgSep, "/"),
            fi.name + fi.extension
          )
        )
      )
    );
  });
}


export function concatFilePaths(p1: string, p2: string): string {
  if (p1.endsWith("/") && p2.startsWith("/")) {
    return p1 + p2.substring(1);
  } else if (!(p1.endsWith("/") || p2.startsWith("/"))) {
    return p1 + "/" + p2;
  } else {
    return p1 + p2;
  }
}
