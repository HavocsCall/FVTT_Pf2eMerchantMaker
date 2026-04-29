import { CRITERIA_PATHS, DEBUG, MODULE_STATE, SORT_FUNCTIONS } from "./constants.js";

export async function initializeMerchantData() {
	const pack = game.packs.get("pf2e.equipment-srd");

	if (!pack) {
		const message = game.i18n.localize("FVTT_PF2EMERCHANTMAKER.ERROR.NOPACK");
		console.error(message);
		ui.notifications?.error(message);
		return;
	}

	const items = await pack.getDocuments();

	if (DEBUG) {
		const sampleSize = 10;
		const sample = [...items].sort(() => 0.5 - Math.random()).slice(0, sampleSize);
		console.log("Sample Items:", sample);
	}

	const criteriaSets = Object.fromEntries(
		Object.keys(CRITERIA_PATHS).map((key) => [key, new Set()])
	);

	if (DEBUG) {
		console.log("Empty Criteria Sets:", criteriaSets);
	}

	for (const item of items) {
		for (const [key, getValue] of Object.entries(CRITERIA_PATHS)) {
			const value = getValue(item);
			if (Array.isArray(value)) {
				value.filter((v) => v != null).forEach((v) => criteriaSets[key].add(v));
			} else if (value != null) {
				criteriaSets[key].add(value);
			}
		}
	}

	if (DEBUG) {
		console.log("Criteria Sets:", criteriaSets);
	}

	const criteria = Object.fromEntries(
		Object.entries(criteriaSets).map(([key, set]) => {
			const array = Array.from(set);
			const sorter = SORT_FUNCTIONS[key] || SORT_FUNCTIONS.default;
			array.sort(sorter);
			return [key, array];
		})
	);

	if (DEBUG) {
		console.log("Sorted Criteria:", criteria);
	}

	MODULE_STATE.items = items;
	MODULE_STATE.criteria = criteria;

	console.log(game.i18n.localize("FVTT_PF2EMERCHANTMAKER.LOGGING.READY"));
}
