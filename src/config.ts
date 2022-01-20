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


function getTemplateConfigString(index: number, key: string): string | undefined {
  const value = workspace.getConfiguration(`pkgnav.template.${index}`)[key] as string | undefined;
  if (value) {
    if (value.trim().length) {
      return value.trim();
    }
  }
}

interface TemplateConfig {
  name: string;
  text: string;
}

function getTemplateConfig(index: number): TemplateConfig | undefined {
  const name = getTemplateConfigString(index, "name");
  if (name) {
    const text = getTemplateConfigString(index, "text");
    if (text) {
      return {
        name,
        text
      };
    }
  }
}

export function getTemplates(): Array<TemplateConfig> {
  const templates = [];
  for (let i = 1; i <= 9; i++) {
    const template = getTemplateConfig(i);
    if (template) {
      templates.push(template);
    }
  }
  return templates;
}