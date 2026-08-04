import { MODULE_ID, SETTINGS } from "./constants.js";

/** Registers all module settings, including optional integrations when those modules are active. */
export function registerModuleSettings() {
	// Client-scoped UX settings apply per-user because they only affect this form's behavior.
	game.settings.register(MODULE_ID, SETTINGS.ADD_CRITERIA_SUMMARY, {
		name: game.i18n.localize("FVTT_PF2EMERCHANTMAKER.SETTINGS.ADDCRITERIASUMMARY.NAME"),
		hint: game.i18n.localize("FVTT_PF2EMERCHANTMAKER.SETTINGS.ADDCRITERIASUMMARY.HINT"),
		scope: "client",
		config: true,
		type: Boolean,
		default: false,
	});

	game.settings.register(MODULE_ID, SETTINGS.CLOSE_ON_SUBMIT, {
		name: game.i18n.localize("FVTT_PF2EMERCHANTMAKER.SETTINGS.CLOSEONSUBMIT.NAME"),
		hint: game.i18n.localize("FVTT_PF2EMERCHANTMAKER.SETTINGS.CLOSEONSUBMIT.HINT"),
		scope: "client",
		config: true,
		type: Boolean,
		default: false,
	});

	if (game.modules.get("itempiles-pf2e")?.active) {
		// World-scoped integration settings affect the generated actor data itself.
		game.settings.register(MODULE_ID, SETTINGS.ITEM_PILES_SETUP, {
			name: game.i18n.localize("FVTT_PF2EMERCHANTMAKER.SETTINGS.ITEMPILESSETUP.NAME"),
			hint: game.i18n.localize("FVTT_PF2EMERCHANTMAKER.SETTINGS.ITEMPILESSETUP.HINT"),
			scope: "world",
			config: true,
			type: Boolean,
			default: false,
		});
	}

	if (game.modules.get("pf2e-toolbelt")?.active) {
		game.settings.register(MODULE_ID, SETTINGS.TOOLBELT_BETTER_MERCHANT_SETUP, {
			name: game.i18n.localize("FVTT_PF2EMERCHANTMAKER.SETTINGS.TOOLBELTBETTERMERCHANTSETUP.NAME"),
			hint: game.i18n.localize("FVTT_PF2EMERCHANTMAKER.SETTINGS.TOOLBELTBETTERMERCHANTSETUP.HINT"),
			scope: "world",
			config: true,
			type: Boolean,
			default: false,
		});
	}
}
