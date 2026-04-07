import { MODULE_ID, SETTINGS } from "./merchant-maker.constants.js";

export function registerModuleSettings() {
	game.settings.register(MODULE_ID, SETTINGS.ADD_CRITERIA_SUMMARY, {
		name: game.i18n.localize("pf2eMerchantMaker.settings.addCriteriaSummary.name"),
		hint: game.i18n.localize("pf2eMerchantMaker.settings.addCriteriaSummary.hint"),
		scope: "client",
		config: true,
		type: Boolean,
		default: false,
	});

	game.settings.register(MODULE_ID, SETTINGS.CLOSE_ON_SUBMIT, {
		name: game.i18n.localize("pf2eMerchantMaker.settings.closeOnSubmit.name"),
		hint: game.i18n.localize("pf2eMerchantMaker.settings.closeOnSubmit.hint"),
		scope: "client",
		config: true,
		type: Boolean,
		default: false,
	});

	if (game.modules.get("itempiles-pf2e")?.active) {
		game.settings.register(MODULE_ID, SETTINGS.ITEM_PILES_SETUP, {
			name: game.i18n.localize("pf2eMerchantMaker.settings.itemPilesSetup.name"),
			hint: game.i18n.localize("pf2eMerchantMaker.settings.itemPilesSetup.hint"),
			scope: "world",
			config: true,
			type: Boolean,
			default: false,
		});
	}

	if (game.modules.get("pf2e-toolbelt")?.active) {
		game.settings.register(MODULE_ID, SETTINGS.TOOLBELT_BETTER_MERCHANT_SETUP, {
			name: game.i18n.localize("pf2eMerchantMaker.settings.toolbeltBetterMerchantSetup.name"),
			hint: game.i18n.localize("pf2eMerchantMaker.settings.toolbeltBetterMerchantSetup.hint"),
			scope: "world",
			config: true,
			type: Boolean,
			default: false,
		});
	}
}
