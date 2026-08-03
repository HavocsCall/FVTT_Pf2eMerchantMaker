import { registerActorDirectoryButton } from "./app.js";
import { registerModuleSettings } from "./settings.js";

Hooks.once("init", () => {
	registerModuleSettings();
});

registerActorDirectoryButton();
