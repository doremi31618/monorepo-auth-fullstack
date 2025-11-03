import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

type RecordData = Record<string, unknown>;

/**
 * Escape a value so it is safe to include in a CSV cell.
 */
function escapeCsvField(value: unknown): string {
	if (value === null || value === undefined) {
		return '';
	}

	const text = String(value);
	const needsQuoting = /["\n,\r]/.test(text);

	if (needsQuoting) {
		return `"${text.replace(/"/g, '""')}"`;
	}

	return text;
}

async function main() {
	const [inputArg = 'data.json', outputArg = 'data.csv'] = process.argv.slice(2);

	const inputPath = resolve(process.cwd(), inputArg);
	const outputPath = resolve(process.cwd(), outputArg);

	const fileContent = await readFile(inputPath, 'utf8');
	const parsed = JSON.parse(fileContent) as { data?: RecordData[] };

	if (!parsed?.data || !Array.isArray(parsed.data) || parsed.data.length === 0) {
		throw new Error('Input JSON must contain a non-empty `data` array.');
	}

	const rows = parsed.data;
	const headerSet = new Set<string>();

	for (const row of rows) {
		for (const key of Object.keys(row)) {
			headerSet.add(key);
		}
	}

	const headers = Array.from(headerSet);

	const csvLines: string[] = [];
	csvLines.push(headers.join(','));

	for (const row of rows) {
		const line = headers.map((header) => escapeCsvField(row[header])).join(',');
		csvLines.push(line);
	}

	await mkdir(dirname(outputPath), { recursive: true });
	await writeFile(outputPath, csvLines.join('\r\n'), 'utf8');

	console.log(`CSV written to ${outputPath}`);
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
