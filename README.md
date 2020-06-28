# Package Navigator

Package Navigator is a VS Code extension that allows for opening project files
by viewing and selecting flattened package names in VS Code's "quick pick" 
dialog.

To use Package Navigator, you describe source locations by defining directory sub-paths, like `src`, `src/tests`, or `src/main/java`.

Directory paths that are found above those paths are considered **modules**, and directory paths that are found below those paths are considered **packages**.

For example, given the following project structure:

```
example
├── client
│   └── src
│       ├── main
│       │   └── com
│       │       └── example
│       │           └── client
│       │               ├── ClientConfig.ext
│       │               ├── Client.ext
│       │               └── Main.ext
│       └── test
│           └── com
│               └── example
│                   └── ClientTests.ext
└── server
    └── src
        ├── main
        │   └── com
        │       └── example
        │           └── server
        │               ├── Main.ext
        │               ├── ServerConfig.ext
        │               ├── Server.ext
        │               └── utils
        │                   └── ServerUtils.ext
        └── test
            └── com
                └── example
                    └── server
                        └── ServerTests.ext
```

This is what it looks like if you navigate to a file starting at the package level:

![Navigating from all packages](https://raw.githubusercontent.com/chris24carroll/pkgnav/main/images/navigate_from_packages.gif)

And this is what it looks like navigating to a file starting from the module level:

![Navigating from modules](https://raw.githubusercontent.com/chris24carroll/pkgnav/main/images/navigate_from_modules.gif)

You can also navigate to a file starting at the "file" level:

![Navigating from all names](https://raw.githubusercontent.com/chris24carroll/pkgnav/main/images/navigate_from_names.gif)

## Commands

Package Navigator provides the following commands:

| Title | Command | Description |
| ----- | ------- | ----------- |
| Open file by modules | pkgnav.openFileByModules | Navigate from the top-level modules, through packages, to a source file |
| Open file by packages | pkgnav.openFileByPackages | Navigate from all packages to a source file |
| Open file by names | pkgnav.openFileByNames | Open a file, selecting from all source file names |
| Open file in the current pacakge | pkgnav.openFileInCurrentPackage | Open a file that is in the same package as the current file |
| Open build file | pkgnav.openBuildFile | Open a file that matches one of the file glob patterns from the `pkgnav.buildFiles` configuration property |
| Open resource file | pkgnav.openResourceFile | Open a file that matches one of the file glob patterns from the `pkgnav.resourceFiles` configuration property |
| Open other file | pkgnav.openOtherFile | Open a file that matches one of the file glob patterns from the `pkgnav.otherFiles` configuration property |
| Reload source files | pkgnav.reload | Ususally Package Navigator automatically detects when the file system or a configuration property is changed. But this command can force a reload of its internal state if necessary |

## Configuration

You'll probably need to change the default settings for Package Navigator to be useful. There are properties to define the list of directory paths to look for sources under, the glob patterns to use when opening other kinds of files, and a few other things like how many directory levels to descend when looking for source directory paths and the separator string to use when displaying a package name.

You can view all the settings and their descriptions by opening up VS Code's settings and seaching for `pkgnav`.

## Keyboard shortcuts

Package Navigator doesn't provide any keyboard shortcuts. But here is an example of a set of keybindings for Package Navigator commands:

```json
{ ...
    {
        "key": "ctrl+o m",
        "command": "pkgnav.openFileByModules"
    },
    {
        "key": "ctrl+o p",
        "command": "pkgnav.openFileByPackages"
    },
    {
        "key": "ctrl+o n",
        "command": "pkgnav.openFileByNames"
    },
    {
        "key": "ctrl+o j",
        "command": "pkgnav.openFileInCurrentPackage"
    },
    {
        "key": "ctrl+o b",
        "command": "pkgnav.openBuildFile"
    },
    {
        "key": "ctrl+o r",
        "command": "pkgnav.openResourceFile"
    },
    {
        "key": "ctrl+o o",
        "command": "pkgnav.openOtherFile"
    }
}
```

## Building

To manually build the Package Navigator extension:

```
git clone https://github.com/chris24carroll/pkgnav.git
cd pkgnav
npm install
vsce package
```

## License

[Apache License 2.0](LICENSE)
