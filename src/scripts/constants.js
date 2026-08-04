/** Stable Foundry module id used for settings, flags, and DOM hooks. */
export const MODULE_ID = "FVTT_Pf2eMerchantMaker";

/** Enables verbose console logging for development and troubleshooting. */
export const DEBUG = false;

/** Shared in-memory cache for compendium items and their derived criteria lists. */
export const MODULE_STATE = {
	items: [],
	criteria: {},
};

/** Setting keys registered under this module. */
export const SETTINGS = {
	ADD_CRITERIA_SUMMARY: "addCriteriaSummary",
	CLOSE_ON_SUBMIT: "closeOnSubmit",
	ITEM_PILES_SETUP: "itemPilesSetup",
	TOOLBELT_BETTER_MERCHANT_SETUP: "toolbeltBetterMerchantSetup",
};

/** Maps each supported criterion to the PF2e item data path used during filtering. */
export const CRITERIA_PATHS = {
	category: (item) => item.system?.category,
	group: (item) => item.system?.group,
	level: (item) => item.system?.level?.value,
	range: (item) => item.system?.range,
	rarity: (item) => item.system?.traits?.rarity,
	traits: (item) => item.system?.traits?.value || [],
	type: (item) => item.type,
};

/** UI metadata for rendering each criteria pane in the merchant form. */
export const CRITERIA_FIELDS = [
	{
		key: "rarity",
		includeLabel: "FVTT_PF2EMERCHANTMAKER.WINDOW.INCLUDERARITY",
		excludeLabel: "FVTT_PF2EMERCHANTMAKER.WINDOW.EXCLUDERARITY",
	},
	{
		key: "type",
		includeLabel: "FVTT_PF2EMERCHANTMAKER.WINDOW.INCLUDETYPE",
		excludeLabel: "FVTT_PF2EMERCHANTMAKER.WINDOW.EXCLUDETYPE",
	},
	{
		key: "category",
		includeLabel: "FVTT_PF2EMERCHANTMAKER.WINDOW.INCLUDECATEGORY",
		excludeLabel: "FVTT_PF2EMERCHANTMAKER.WINDOW.EXCLUDECATEGORY",
	},
	{
		key: "group",
		includeLabel: "FVTT_PF2EMERCHANTMAKER.WINDOW.INCLUDEGROUP",
		excludeLabel: "FVTT_PF2EMERCHANTMAKER.WINDOW.EXCLUDEGROUP",
	},
	{
		key: "level",
		includeLabel: "FVTT_PF2EMERCHANTMAKER.WINDOW.INCLUDELEVEL",
		excludeLabel: "FVTT_PF2EMERCHANTMAKER.WINDOW.EXCLUDELEVEL",
	},
	{
		key: "range",
		includeLabel: "FVTT_PF2EMERCHANTMAKER.WINDOW.INCLUDERANGE",
		excludeLabel: "FVTT_PF2EMERCHANTMAKER.WINDOW.EXCLUDERANGE",
		isRange: true,
	},
	{
		key: "traits",
		includeLabel: "FVTT_PF2EMERCHANTMAKER.WINDOW.INCLUDETRAITS",
		excludeLabel: "FVTT_PF2EMERCHANTMAKER.WINDOW.EXCLUDETRAITS",
	},
];

/** Sorting precedence used for rarity-first item ordering in generated merchants. */
export const RARITY_ORDER = {
	common: 0,
	uncommon: 1,
	rare: 2,
	unique: 3,
};

/** Reusable comparators for criteria normalization and final item display ordering. */
export const SORT_FUNCTIONS = {
	rarity: (a, b) => (RARITY_ORDER[a] ?? 5) - (RARITY_ORDER[b] ?? 5),
	level: (a, b) => a - b,
	range: (a, b) => a - b,
	default: (a, b) => String(a).localeCompare(String(b)),
};

/** Additional item paths used for exclusion rules outside the user-facing criteria panes. */
export const EXCLUDE_CRITERIA_PATHS = {
	slug: (item) => item.system?.slug,
};

/** Known problematic or non-merchant-friendly item slugs that are always filtered out. */
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

/** Quantity bounds enforced for merchant stock generation. */
export const QUANTITY_MIN = 1;
export const QUANTITY_MAX = 99;
