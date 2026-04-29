import { initializeMerchantData } from "./criteria-data.js";
import { registerActorDirectoryButton } from "./app.js";
import { registerModuleSettings } from "./settings.js";

Hooks.once("init", () => {
	registerModuleSettings();
});

Hooks.once("ready", async () => {
	await initializeMerchantData();
});

registerActorDirectoryButton();
