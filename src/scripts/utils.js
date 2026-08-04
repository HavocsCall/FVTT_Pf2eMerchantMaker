/** Clamps user-provided numeric input into a safe integer range with a fallback value. */
export const clampInteger = (value, min, max, fallback) => {
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) return fallback;

	const floored = Math.floor(parsed);
	if (Number.isNaN(floored)) return fallback;

	return Math.min(max, Math.max(min, floored));
};

/** Inclusive integer roll helper shared by quantity and random item selection logic. */
export const rollIntegerBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Range is summarized separately because the UI exposes derived "Melee/Ranged" buckets instead of
// only the raw numeric range values from the PF2e compendium.
const formatRangeCriteria = (value) => {
	if (!value || typeof value !== "object") return "";

	const segments = [];
	if (value.melee) segments.push(game.i18n.localize("FVTT_PF2EMERCHANTMAKER.WINDOW.MELEE"));
	if (value.ranged) {
		const rangedLabel = game.i18n.localize("FVTT_PF2EMERCHANTMAKER.WINDOW.RANGED");
		segments.push(
			value.values?.length > 0 ? `${rangedLabel} (${value.values.join(", ")})` : rangedLabel
		);
	}

	return segments.join(", ");
};

export const buildCriteriaSummary = (
	includedCriteria,
	excludedCriteria,
	quantityConfig,
	amountConfig,
	totalMatches,
	selectedCount
) => {
	const quantitySummary =
		quantityConfig.type === "random"
			? `Random (${quantityConfig.min}-${quantityConfig.max})`
			: `Set (${quantityConfig.amount})`;

	const itemsReturnedSummary = (() => {
		if (amountConfig.type === "all") return "All";
		if (amountConfig.type === "set") return `Set (${Math.min(amountConfig.count, totalMatches)})`;

		// Keep the requested random range visible, but also report when the actual matched pool forced
		// a smaller outcome.
		const requestedRange = `Random (${amountConfig.min}-${amountConfig.max})`;
		if (totalMatches < amountConfig.min) {
			return `${requestedRange}, only ${totalMatches} matched`;
		}

		return `${requestedRange}, selected ${selectedCount}`;
	})();

	return {
		Included: includedCriteria,
		Excluded: excludedCriteria,
		Options: {
			Quantity: quantitySummary,
			"Items Returned": itemsReturnedSummary,
		},
	};
};

/** Converts the structured criteria summary into the GM-only HTML snippet stored on the actor. */
export const formatCriteriaSummary = (summary) => {
	return Object.entries(summary)
		.map(([section, values]) => {
			const rows = Object.entries(values ?? {})
				.filter(([, value]) => {
					if (Array.isArray(value)) return value.length > 0;
					if (typeof value === "object") return Boolean(formatRangeCriteria(value));
					return value !== undefined && value !== null && value !== "";
				})
				.map(([label, value]) => {
					const displayValue = Array.isArray(value)
						? value.join(", ")
						: typeof value === "object"
							? formatRangeCriteria(value)
							: value;
					const formattedLabel = label.replace(/\b\w/g, (char) => char.toUpperCase());
					return `${formattedLabel}: ${displayValue}`;
				});

			if (rows.length === 0) return null;

			return `<strong>${section}:</strong><br>${rows.join("<br>")}`;
		})
		.filter(Boolean)
		.join("<br><br>");
};
