// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as pkgnav from './pkgnav';
import * as commands from './commands';


function registerCommand(ctx: vscode.ExtensionContext, id: string, cmd: () => void) {
	ctx.subscriptions.push(
		vscode.commands.registerCommand(id, () => {
			// Make sure the extension is initialized before running the command
			pkgnav.init().then(cmd);
		})
	);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	registerCommand(context, 'pkgnav.openFileByModules', commands.openFileByModules);
	registerCommand(context, 'pkgnav.openFileByPackages', commands.openFileByPackages);
	registerCommand(context, 'pkgnav.openFileByNames', commands.openFileByNames);
	registerCommand(context, 'pkgnav.openFileInCurrentPackage', commands.openFileInCurrentPackage);
	registerCommand(context, 'pkgnav.openResourceFile', commands.openResourceFile);
	registerCommand(context, 'pkgnav.openBuildFile', commands.openBuildFile);
	registerCommand(context, 'pkgnav.openOtherFile', commands.openOtherFile);
	registerCommand(context, 'pkgnav.reload', commands.reload);
}

// this method is called when your extension is deactivated
export function deactivate() { }
