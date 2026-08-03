import { CRITERIA_FIELDS, MODULE_ID, MODULE_STATE, SETTINGS } from "./constants.js";
import { ensureMerchantDataInitialized } from "./criteria-data.js";
import { generateMerchantFromFormData } from "./generator.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

function collectCheckedCriteria(form) {
	const checkedCriteria = form.querySelectorAll(
		'input[type="checkbox"][name^="include-"]:checked, input[type="checkbox"][name^="exclude-"]:checked'
	);
	const criteriaData = {
		included: {},
		excluded: {},
	};

	for (const input of checkedCriteria) {
		if (!input.name) continue;

		const [scope, ...labelParts] = input.name.split("-");
		if (!["include", "exclude"].includes(scope) || labelParts.length === 0) continue;

		const bucket = scope === "include" ? criteriaData.included : criteriaData.excluded;
		const [label, subType] = labelParts;

		if (label === "range") {
			bucket.range ??= { melee: false, ranged: false, values: [] };

			if (subType === "kind") {
				bucket.range[input.value] = true;
			} else if (subType === "value") {
				bucket.range.values.push(input.value);
			}

			continue;
		}

		bucket[label] ??= [];
		bucket[label].push(input.value);
	}

	for (const bucket of [criteriaData.included, criteriaData.excluded]) {
		if (!bucket.range) continue;

		if (!bucket.range.ranged) {
			bucket.range.values = [];
		}

		if (!bucket.range.melee && !bucket.range.ranged) {
			delete bucket.range;
		}
	}

	return criteriaData;
}

export class Pf2eMerchantMakerApp extends HandlebarsApplicationMixin(ApplicationV2) {
	get title() {
		return game.i18n.localize("FVTT_PF2EMERCHANTMAKER.NAME");
	}

	static DEFAULT_OPTIONS = {
		tag: "form",
		form: {
			handler: this.handleFormSubmit,
			submitOnChange: false,
			closeOnSubmit: false,
		},
		id: `${MODULE_ID}-window`,
		width: "auto",
		height: "auto",
		resizable: true,
	};

	static PARTS = {
		tabs: { template: "templates/generic/tab-navigation.hbs" },
		merchantMaker: { template: `modules/${MODULE_ID}/src/templates/pf2eMerchantMaker.hbs` },
		advancedOptions: { template: `modules/${MODULE_ID}/src/templates/advancedOptions.hbs` },
		footer: { template: "templates/generic/form-footer.hbs" },
	};

	static TABS = {
		primary: {
			tabs: [
				{ id: "merchantMaker", label: "FVTT_PF2EMERCHANTMAKER.NAME" },
				{ id: "advancedOptions", label: "FVTT_PF2EMERCHANTMAKER.WINDOW.ADVANCEDOPTIONS" },
			],
			initial: "merchantMaker",
		},
	};

	async _preparePartContext(partId, context) {
		switch (partId) {
			case "merchantMaker":
			case "advancedOptions":
				context.tab = context.tabs[partId];
				break;
			default:
		}
		return context;
	}

	async _prepareContext(_options) {
		return {
			tabs: this._prepareTabs("primary"),
			buttons: [
				{
					type: "submit",
					label: "FVTT_PF2EMERCHANTMAKER.WINDOW.SUBMIT",
					icon: "fa-solid fa-hand-holding-dollar",
				},
				{
					type: "reset",
					label: "FVTT_PF2EMERCHANTMAKER.WINDOW.RESET",
					icon: "fa-solid fa-arrow-rotate-left",
				},
			],
			criteria: MODULE_STATE.criteria,
			criteriaFields: CRITERIA_FIELDS,
		};
	}

	static async handleFormSubmit(_event, form, formData) {
		const submittedData = {
			...formData.object,
			...collectCheckedCriteria(form),
		};

		await generateMerchantFromFormData(submittedData);
	}
}

export function registerActorDirectoryButton() {
	Hooks.on("renderActorDirectory", (tab, html) => {
		const footer = html.querySelector(".directory-footer.action-buttons");
		if (!footer) return;
		if (footer.querySelector(`#${MODULE_ID}`)) return;

		footer.insertAdjacentHTML(
			"afterbegin",
			`
        <button id="${MODULE_ID}">
            <i class="fa-solid fa-hand-holding-dollar"></i>
            <span style="font-weight: 400; font-family: var(--font-sans);">${game.i18n.localize("FVTT_PF2EMERCHANTMAKER.NAME")}</span>
        </button>
        `
		);

		footer.querySelector(`#${MODULE_ID}`).onclick = async () => {
			await ensureMerchantDataInitialized();

			if (
				!Array.isArray(MODULE_STATE.items) ||
				MODULE_STATE.items.length === 0 ||
				!MODULE_STATE.criteria ||
				Object.keys(MODULE_STATE.criteria).length === 0
			) {
				ui.notifications?.error(game.i18n.localize("FVTT_PF2EMERCHANTMAKER.ERROR.NOTREADY"));
				return;
			}

			new Pf2eMerchantMakerApp({
				form: { closeOnSubmit: game.settings.get(MODULE_ID, SETTINGS.CLOSE_ON_SUBMIT) ?? false },
			}).render(true);
		};
	});
}
