import { promises as fs } from "fs";
import path from "path";

const premadeShopsDir = path.join(process.cwd(), "src", "packs", "premadeShops");
const rarityOrder = new Map([
	["common", 0],
	["uncommon", 1],
	["rare", 2],
	["unique", 3],
]);

const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

const jsonFiles = await getJsonFiles(premadeShopsDir);
let updatedFiles = 0;
const SORT_STEP = 100000;

for (const filePath of jsonFiles) {
	const raw = await fs.readFile(filePath, "utf8");
	const data = JSON.parse(raw);

	if (!Array.isArray(data.items)) continue;

	const sortedItems = [...data.items].sort(compareItems);
	const normalizedItems = sortedItems.map((item, index) => ({
		...item,
		sort: (index + 1) * SORT_STEP,
	}));
	if (arraysEqual(data.items, normalizedItems)) continue;

	data.items = normalizedItems;
	await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
	updatedFiles += 1;
}

console.log(`Processed ${jsonFiles.length} files. Updated ${updatedFiles} file(s).`);

function compareItems(a, b) {
	const rarityA = getRarityRank(a);
	const rarityB = getRarityRank(b);
	if (rarityA !== rarityB) return rarityA - rarityB;

	const levelA = getLevel(a);
	const levelB = getLevel(b);
	if (levelA !== levelB) return levelA - levelB;

	const nameA = getName(a);
	const nameB = getName(b);
	return collator.compare(nameA, nameB);
}

function getRarityRank(item) {
	const rarity = item?.system?.traits?.rarity ?? item?.rarity ?? item?.system?.rarity ?? "common";
	return rarityOrder.get(String(rarity).toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
}

function getLevel(item) {
	const level = item?.system?.level?.value ?? item?.level ?? 0;
	const numericLevel = Number(level);
	return Number.isFinite(numericLevel) ? numericLevel : Number.MAX_SAFE_INTEGER;
}

function getName(item) {
	return String(item?.name ?? "");
}

function arraysEqual(original, sorted) {
	if (original.length !== sorted.length) return false;
	return original.every((item, index) => {
		const other = sorted[index];
		return item === other || (item._id === other._id && item.sort === other.sort);
	});
}

async function getJsonFiles(directory) {
	const entries = await fs.readdir(directory, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const fullPath = path.join(directory, entry.name);
			if (entry.isDirectory()) return getJsonFiles(fullPath);
			if (entry.isFile() && entry.name.endsWith(".json")) return [fullPath];
			return [];
		})
	);
	return files.flat();
}
