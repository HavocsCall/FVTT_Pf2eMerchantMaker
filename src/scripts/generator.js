import {
	CRITERIA_PATHS,
	DEBUG,
	EXCLUDE_CRITERIA_PATHS,
	EXCLUDE_SLUGS,
	MODULE_ID,
	MODULE_STATE,
	QUANTITY_MAX,
	QUANTITY_MIN,
	SETTINGS,
	SORT_FUNCTIONS,
} from "./constants.js";
import {
	buildCriteriaSummary,
	clampInteger,
	formatCriteriaSummary,
	rollIntegerBetween,
} from "./utils.js";

export async function generateMerchantFromFormData(data) {
	if (DEBUG) {
		console.log("Form Data:", data);
	}

	const quantityMode = data["quantity-mode"] ?? "set";
	const randomQuantityMin = clampInteger(
		data["random-quantity-min"],
		QUANTITY_MIN,
		QUANTITY_MAX,
		QUANTITY_MIN
	);
	const randomQuantityMax = clampInteger(
		data["random-quantity-max"],
		QUANTITY_MIN,
		QUANTITY_MAX,
		randomQuantityMin
	);
	const quantityConfig =
		quantityMode === "random"
			? {
					type: "random",
					min: Math.min(randomQuantityMin, randomQuantityMax),
					max: Math.max(randomQuantityMin, randomQuantityMax),
				}
			: {
					type: "set",
					amount: clampInteger(data["set-quantity"], QUANTITY_MIN, QUANTITY_MAX, QUANTITY_MIN),
				};

	const resolveQuantity = () => {
		if (quantityConfig.type === "random") {
			return rollIntegerBetween(quantityConfig.min, quantityConfig.max);
		}

		return quantityConfig.amount;
	};

	const amountMode = data["amount-mode"] ?? "all";
	const randomAmountMin = clampInteger(data["random-amount-min"], 1, Number.MAX_SAFE_INTEGER, 1);
	const randomAmountMax = clampInteger(
		data["random-amount-max"],
		1,
		Number.MAX_SAFE_INTEGER,
		randomAmountMin
	);
	const amountConfig =
		amountMode === "set"
			? {
					type: "set",
					count: clampInteger(data["set-amount"], 1, Number.MAX_SAFE_INTEGER, 1),
				}
			: amountMode === "random"
				? {
						type: "random",
						min: Math.min(randomAmountMin, randomAmountMax),
						max: Math.max(randomAmountMin, randomAmountMax),
					}
				: { type: "all" };

	const merchantName = data.merchantName?.trim()
		? data.merchantName
		: game.i18n.localize("FVTT_PF2EMERCHANTMAKER.LABELS.DEFAULTMERCHANTNAME");

	const included = {};
	const excluded = {};
	const normalizeCriteriaValues = (value) => {
		if (Array.isArray(value)) {
			return value.filter(
				(entry) => entry !== undefined && entry !== null && String(entry).trim() !== ""
			);
		}
		if (value === undefined || value === null || value === "") return [];
		return [value];
	};

	for (const [key, value] of Object.entries(data)) {
		if (key.startsWith("include-")) {
			const values = normalizeCriteriaValues(value);
			if (values.length === 0) continue;

			const label = key.replace("include-", "");
			included[label] = values;
		}

		if (key.startsWith("exclude-")) {
			const values = normalizeCriteriaValues(value);
			if (values.length === 0) continue;

			const label = key.replace("exclude-", "");
			excluded[label] = values;
		}
	}

	const numberKeys = ["level", "range"];

	for (const key of numberKeys) {
		if (included[key]) included[key] = included[key].map(Number);
		if (excluded[key]) excluded[key] = excluded[key].map(Number);
	}

	if (DEBUG) {
		console.log("Included Criteria:", included);
		console.log("Excluded Criteria:", excluded);
	}

	const items = MODULE_STATE.items;

	const unsortedMatches = items.filter((item) => {
		const slug = EXCLUDE_CRITERIA_PATHS.slug(item);
		if (slug && EXCLUDE_SLUGS.includes(slug)) return false;

		for (const [key, allowedValues] of Object.entries(included)) {
			const value = CRITERIA_PATHS[key]?.(item);
			if (value === undefined) return false;

			if (Array.isArray(value)) {
				if (!allowedValues.some((v) => value.includes(v))) return false;
			} else if (!allowedValues.includes(value)) {
				return false;
			}
		}

		for (const [key, excludedValues] of Object.entries(excluded)) {
			const value = CRITERIA_PATHS[key]?.(item);
			if (value === undefined) continue;

			if (Array.isArray(value)) {
				if (excludedValues.some((v) => value.includes(v))) return false;
			} else if (excludedValues.includes(value)) {
				return false;
			}
		}

		return true;
	});

	if (DEBUG) {
		console.log("Unsorted Matches:", unsortedMatches);
	}

	const sortedMatches = unsortedMatches.sort((a, b) => {
		const rarityA = CRITERIA_PATHS.rarity(a);
		const rarityB = CRITERIA_PATHS.rarity(b);
		const rarityComparison = SORT_FUNCTIONS.rarity(rarityA, rarityB);
		if (rarityComparison !== 0) return rarityComparison;

		const levelA = CRITERIA_PATHS.level(a);
		const levelB = CRITERIA_PATHS.level(b);
		const levelComparison = SORT_FUNCTIONS.level(levelA, levelB);
		if (levelComparison !== 0) return levelComparison;

		const nameA = a.name.toLowerCase();
		const nameB = b.name.toLowerCase();
		return SORT_FUNCTIONS.default(nameA, nameB);
	});

	if (DEBUG) {
		console.log("Sorted Matches:", sortedMatches);
	}

	const selectedMatches = (() => {
		if (amountConfig.type === "set") {
			const limit = Math.min(amountConfig.count, sortedMatches.length);
			if (limit === 0) return [];
			if (limit === sortedMatches.length) return [...sortedMatches];

			const indices = new Set();

			while (indices.size < limit) {
				indices.add(rollIntegerBetween(0, sortedMatches.length - 1));
			}

			return Array.from(indices)
				.sort((a, b) => a - b)
				.map((index) => sortedMatches[index]);
		}

		if (amountConfig.type === "random") {
			if (sortedMatches.length === 0) return [];

			const upper = Math.min(amountConfig.max, sortedMatches.length);
			const lower = Math.min(amountConfig.min, upper);
			const target = rollIntegerBetween(lower, upper);
			const indices = new Set();

			while (indices.size < target) {
				indices.add(rollIntegerBetween(0, sortedMatches.length - 1));
			}

			return Array.from(indices)
				.sort((a, b) => a - b)
				.map((index) => sortedMatches[index]);
		}

		return [...sortedMatches];
	})();

	if (DEBUG) {
		console.log("Quantity Config:", quantityConfig);
		console.log("Amount Config:", amountConfig);
		console.log("Selected Matches:", selectedMatches);
	}

	const preparedItems = selectedMatches.map((item) => {
		const itemData = item.toObject();
		itemData.system = itemData.system ?? {};
		itemData.system.quantity = resolveQuantity();
		return itemData;
	});

	const criteriaSummary = buildCriteriaSummary(
		included,
		excluded,
		quantityConfig,
		amountConfig,
		sortedMatches.length
	);

	const actorSystemData = {
		lootSheetType: "Merchant",
	};

	const formattedCriteriaSummary = formatCriteriaSummary(criteriaSummary);

	if (game.settings.get(MODULE_ID, SETTINGS.ADD_CRITERIA_SUMMARY) && formattedCriteriaSummary) {
		actorSystemData.details = {
			description: `<div data-visibility="gm">${formattedCriteriaSummary}</div>\n<hr />\n<p></p>\n`,
		};
	}

	const newMerchant = await Actor.implementation.create({
		name: merchantName,
		type: "loot",
		system: actorSystemData,
		items: preparedItems,
	});

	await newMerchant.setFlag(MODULE_ID, "criteria", criteriaSummary);

	if (game.modules.get("itempiles-pf2e")?.active) {
		if (game.settings.get(MODULE_ID, SETTINGS.ITEM_PILES_SETUP)) {
			await newMerchant.setFlag("item-piles", "data", {
				type: "merchant",
				merchantColumns: [
					{
						label: game.i18n.localize("FVTT_PF2EMERCHANTMAKER.LABELS.RARITY"),
						path: "system.traits.rarity",
						formatting: "{#}",
						buying: true,
						selling: true,
						mapping: {
							common: "PF2E.TraitCommon",
							uncommon: "PF2E.TraitUncommon",
							rare: "PF2E.TraitRare",
							unique: "PF2E.TraitUnique",
						},
					},
					{
						label: game.i18n.localize("FVTT_PF2EMERCHANTMAKER.LABELS.BULK"),
						path: "system.bulk.value",
						formatting: "{#}",
						buying: true,
						selling: true,
						mapping: {
							0: "",
						},
					},
					{
						label: game.i18n.localize("FVTT_PF2EMERCHANTMAKER.LABELS.LEVEL"),
						path: "system.level.value",
						formatting: "{#}",
						mapping: {},
						buying: true,
						selling: true,
					},
				],
				infiniteQuantity: true,
				hideTokenWhenClosed: true,
				distance: null,
				enabled: true,
			});
		}
	}

	if (game.modules.get("pf2e-toolbelt")?.active) {
		if (game.settings.get(MODULE_ID, SETTINGS.TOOLBELT_BETTER_MERCHANT_SETUP)) {
			await newMerchant.setFlag("pf2e-toolbelt", "betterMerchant", {
				infiniteAll: true,
			});
		}
	}
}
