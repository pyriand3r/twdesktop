# twdesktop

twdesktop is a desktop app to provide a convenient way to access your [tiddly wikis](http://www.tiddlywiki.com) in one click (well, okay two to be honest: Right click on contextmenu, left click on wiki to open).

This [electron](https://www.electron.atom.io) app will live in your tray, providing a fast and non intrusive access to all of your tiddly wiki files. Auto-save on change included (if desired).

## Planned feature set ...so far

[x] Open Wikis in own window
[x] Save wikis on change
[] Option to deactivate autosave
[] Register multiple wiki files
[] Create tray contextmenu entry for every registered wiki (show/hide)
[] Define default wiki (show/hide on left-click of tray icon)
[x] Option for changing color of tray icon (light/dark)
[] Option for keeping wiki open in background on close (instead of closing it completely)

## Roadmap

### 0.1 - Cleanup code and basic setup

* Providing basic functionality: Opening one wiki, saving on change. Tray icon.  
* Only one wiki file supported, configurabe in the config file (no settings window so far).
* Code of the proof-of-concept needs to be cleaned up und separated.
* Configure electron-builder for building packages
* Set up travis for automated builds

### 0.2 - Multiple files and settings

* Settings window for setting application settings
    * Register multiple wiki files
    * Set one wiki as default
    * Set basic configuration (tray icon color, autosave, keep open on window close)