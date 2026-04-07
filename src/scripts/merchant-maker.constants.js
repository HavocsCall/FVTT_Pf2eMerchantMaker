export const MODULE_ID = "FVTT-PF2E-Merchant-Maker";

export const DEBUG = false;

export const MODULE_STATE = {
	items: [],
	criteria: {},
};

export const SETTINGS = {
	ADD_CRITERIA_SUMMARY: "addCriteriaSummary",
	CLOSE_ON_SUBMIT: "closeOnSubmit",
	ITEM_PILES_SETUP: "itemPilesSetup",
	TOOLBELT_BETTER_MERCHANT_SETUP: "toolbeltBetterMerchantSetup",
};

export const CRITERIA_PATHS = {
	category: (item) => item.system?.category,
	group: (item) => item.system?.group,
	level: (item) => item.system?.level?.value,
	range: (item) => item.system?.range,
	rarity: (item) => item.system?.traits?.rarity,
	traits: (item) => item.system?.traits?.value || [],
	type: (item) => item.type,
};

export const RARITY_ORDER = {
	common: 0,
	uncommon: 1,
	rare: 2,
	unique: 3,
};

export const SORT_FUNCTIONS = {
	rarity: (a, b) => (RARITY_ORDER[a] ?? 5) - (RARITY_ORDER[b] ?? 5),
	level: (a, b) => a - b,
	range: (a, b) => a - b,
	default: (a, b) => String(a).localeCompare(String(b)),
};

export const EXCLUDE_CRITERIA_PATHS = {
	slug: (item) => item.system?.slug,
};

export const EXCLUDE_SLUGS = [
	"amulet-implement",
	"bands-of-imprisonment",
	"bakuwa-lizardfolk-bony-plates",
	"bell-implement",
	"chalice-implement",
	"fetching-bangles",
	"hardshell-surki-carapace",
	"horn-of-plenty",
	"lantern-implement",
	"mirror-implement",
	"orc-warmask",
	"pelt-of-the-beast",
	"power-suit",
	"regalia-implement",
	"reinforced-chassis",
	"rite-of-reinforcement-exoskeleton",
	"skybearers-belt",
	"splendid-skull-mask",
	"subterfuge-suit",
	"thousand-league-sandals",
	"titan-nagaji-scales",
	"tough-skin",
	"tome-implement",
	"versatile-vial",
	"victors-wreath",
	"wand-implement",
];

export const QUANTITY_MIN = 1;
export const QUANTITY_MAX = 99;
