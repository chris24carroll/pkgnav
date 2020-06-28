import { workspace } from 'vscode';

export function getModuleSearchDepth() {
  return workspace.getConfiguration("pkgnav")["moduleSearchDepth"] as number;
}

export function getSources() {
  return workspace.getConfiguration("pkgnav")["sources"] as Array<string>;
}

export function getSourcesIgnorePattern() {
  return workspace.getConfiguration("pkgnav")["sourcesIgnore"] as undefined | string;
}

export function getBuildFilePatterns() {
  return workspace.getConfiguration("pkgnav")["buildFiles"] as Array<string>;
}

export function getResourceFilePatterns() {
  return workspace.getConfiguration("pkgnav")["resourceFiles"] as Array<string>;
}

export function getOtherFilePatterns() {
  return workspace.getConfiguration("pkgnav")["otherFiles"] as Array<string>;
}

export function getPackageSeparator(): string {
  return workspace.getConfiguration("pkgnav")["packageSeparator"];
}