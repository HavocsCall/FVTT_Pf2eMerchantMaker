import { registerActorDirectoryButton } from "./app.js";
import { registerModuleSettings } from "./settings.js";

/** Register settings early so they are available before any UI opens. */
Hooks.once("init", () => {
	registerModuleSettings();
});

/** Attach the Actor Directory button as soon as the module scripts are evaluated. */
registerActorDirectoryButton();
