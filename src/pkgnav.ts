import { workspace, Uri, CancellationTokenSource } from 'vscode';
import * as config from './config';
import * as vsutils from './vsutils';
import { fileInfo, FileInfo } from './fileutils';
import { composeThenables, flatten } from './utils';

// make sure we only initialize once
var initialized = false;

export function init(): Thenable<void> {
  if (initialized) {
    return new Promise((resolve, _) => resolve());
  } else {
    initialized = true;
    workspace.onDidChangeWorkspaceFolders(reload);
    workspace.onDidChangeConfiguration(reload);
    workspace.onDidRenameFiles(reload);
    workspace.onDidCreateFiles(reload);
    workspace.onDidDeleteFiles(reload);
    return reload();
  }
}

// Current on-going load operations. If a reload is requested we cancel them
const operations: Array<CancellationTokenSource> = [];

// Cancel anything already going on
function cancelLoad() {
  operations.forEach(cts => cts.cancel());
  operations.splice(0);
}

type FileSet = { [key: string]: FileInfo; };


// keep the source files in memory (as opposed ot resources, build files, etc)
// since these are the files that we'll navigat to by modules and packages
var sources: FileSet = {};

export function getSources(): FileSet {
  return sources;
}

export function reload(): Thenable<void> {
  cancelLoad();
  sources = {};

  const searchDepth = config.getModuleSearchDepth();
  const configuredSources = config.getSources();
  const pkgSep = config.getPackageSeparator();
  const sourcesIgnorePattern = config.getSourcesIgnorePattern();


  const loads: Array<Thenable<void>> =
    configuredSources.map(src =>
      loadFiles(sources, searchDepth, src, pkgSep, sourcesIgnorePattern)
    );

  return composeThenables(loads).then(voids => { return; });
}

function searchPattern(depth: number, path: string) {
  var pattern = path;

  while (pattern.startsWith("/")) {
    pattern = pattern.substring(1);
  }

  for (var i = 0; i < depth; i++) {
    pattern = "*/" + pattern;
  }

  if (!pattern.endsWith("/")) {
    pattern = pattern + "/";
  }

  pattern += "**";

  return pattern;
}

function processFile(fileSet: FileSet, root: string, subRoot: string, file: Uri, pkgSep: string) {
  const alreadyProcessed = fileSet[file.path];
  // If one sub root is under another, we want don't want the parent one. 
  // So pick the one with the longer length.
  if (alreadyProcessed === undefined || alreadyProcessed.subRoot.length <= subRoot.length) {
    fileInfo(root, subRoot, file.path, pkgSep).forEach(fi => {
      fileSet[file.path] = fi;
    });
  }
}

// Look for directories matching searchPath under the project root.
//
// Check up to searchDepth levels deep. When we find a match, 
// collect all the files under the searchPath and store it in fileSet.
function loadFiles(
  fileSet: FileSet,
  searchDepth: number,
  searchPath: string,
  pkgSep: string,
  sourcesIgnorePattern: undefined | string): Thenable<void> {

  return vsutils.workspaceFolder().fold(
    () => new Promise((resolve, reject) => {
      resolve();
    }),
    uri => {
      const root = uri.path;
      return composeThenables(
        Array(searchDepth).fill(undefined).map((x, i) => i).map(depth => {
          const pattern = searchPattern(depth, searchPath);
          var cts = new CancellationTokenSource();
          var token = cts.token;
          operations.push(cts);

          let ignore;
          if (sourcesIgnorePattern && sourcesIgnorePattern.length > 0) {
            ignore = sourcesIgnorePattern;
          } else {
            ignore = undefined;
          }

          return workspace.findFiles(pattern, ignore, undefined, token).then(files => {
            files.forEach(file => {
              processFile(fileSet, root, searchPath, file, pkgSep);
            });
          });
        })
      ).then(voids => { return; });
    }
  );
}

// Simple string sort function
function compare(s1: string, s2: string): number {
  if (s1 < s2) {
    return -1;
  } else if (s2 < s1) {
    return 1;
  } else {
    return 0;
  }
}

export function allModules(): Array<string> {

  const modules = new Set<string>();

  Object.values(getSources()).forEach(fi => {
    modules.add(fi.module);
  });


  return Array.from(modules).sort(compare);
}

export function allPackages(): Array<string> {

  const pkgs = new Set<string>();

  Object.values(getSources()).forEach(fi => {
    pkgs.add(fi.package);
  });


  return Array.from(pkgs).sort(compare);
}

export function fileNamesForPackage(pkg: string): Array<string> {
  const names = new Set<string>();
  Object.values(getSources()).forEach(fi => {
    if (fi.package === pkg) {
      names.add(fi.name);
    }
  });

  return Array.from(names).sort(compare);
}

export function filesForPackageAndName(pkg: string, name: string): Array<string> {

  const files = new Set<string>();
  Object.entries(getSources()).forEach(entry => {
    if (entry[1].name === name && entry[1].package === pkg) {
      files.add(entry[0]);
    }
  });

  return Array.from(files).sort(compare);
}

export function filesForModuleAndPackageAndName(m: string, pkg: string, name: string): Array<string> {

  const files = new Set<string>();
  Object.entries(getSources()).forEach(entry => {
    if (entry[1].name === name && entry[1].package === pkg && entry[1].module === m) {
      files.add(entry[0]);
    }
  });

  return Array.from(files).sort(compare);
}

export function allNames(): Array<string> {
  const names = new Set<string>();
  Object.values(getSources()).forEach(fi => {
    names.add(fi.name);
  });

  return Array.from(names).sort(compare);
}

export function filesForName(name: string): Array<string> {
  const files = new Set<string>();
  Object.entries(getSources()).forEach(entry => {
    if (entry[1].name === name) {
      files.add(entry[0]);
    }
  });

  return Array.from(files).sort(compare);
}

function findFiles(pattern: string): Thenable<Array<string>> {
  return workspace.findFiles(pattern).then(files => files.map(f => f.path));
}

export function getBuildFiles(): Thenable<Array<string>> {
  return composeThenables(config.getBuildFilePatterns().map(findFiles)).then(flatten);
}

export function getResourceFiles(): Thenable<Array<string>> {
  return composeThenables(config.getResourceFilePatterns().map(findFiles)).then(flatten);
}

export function getOtherFiles(): Thenable<Array<string>> {
  return composeThenables(config.getOtherFilePatterns().map(findFiles)).then(flatten);
}

export function packageForFile(file: string) {
  const entry = Object.entries(sources).find(entry => {
    return entry[0] === file;
  });
  if (entry) {
    return entry[1].package;
  }
}

export function packagesForModule(m: String): Array<string> {
  const pkgs = new Set<string>();
  Object.values(sources).forEach(fi => {
    if (fi.module === m) {
      pkgs.add(fi.package);
    }
  });
  return Array.from(pkgs).sort(compare);
}

export function namesForPackage(pkg: String): Array<string> {
  const names = new Set<string>();
  Object.values(sources).forEach(fi => {
    if (fi.package === pkg) {
      names.add(fi.name);
    }
  });
  return Array.from(names).sort(compare);
}

export function info(filePath: string): FileInfo | undefined {
  return sources[filePath];
}

export function fileForInfo(info: FileInfo): string | undefined {
  let file = undefined;
  Object.entries(sources).forEach(entry => {
    const fi = entry[1];
    if (fi.name === info.name && fi.package === info.package && fi.module === info.module && fi.subRoot === info.subRoot) {
      file = entry[0];
    }
  });
  return file;
}