import { Timestamp } from "@sapphire/time-utilities";
import { GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { config } from "./Main";
import { Spreadsheet } from "./Spreadsheet";
import { Util } from "./Util";

export class CurrencySystem {
	private sheet: Spreadsheet;

	public constructor(sheet: Spreadsheet) {
		this.sheet = sheet;
	}

	public async add(currency: string, from: string, to: string, amount: number, reason: string): Promise<void> {
		if (currency === "all") {
			for (let i: number = 0; i < config.get().currencies.length; i++) {
				await this.add(config.get().currencies[i], from, to, amount, reason);
			}
			return;
		}
		const worksheet: GoogleSpreadsheetWorksheet = await this.sheet.worksheet(Util.capitalize(currency));
		await worksheet.addRow({
			"Awarded By": from,
			"Awarded To": to,
			"Amount": amount,
			"Reason": reason,
			"Time": new Timestamp("MM-DD-YYYY HH:mm:ss").displayUTC()
		});
	}

	public async remove(currency: string, from: string, to: string, amount: number, reason: string): Promise<void> {
		await this.add(currency, from, to, -amount, reason);
	}

	public async balance(currency: string, of: string): Promise<number> {
		const rows: GoogleSpreadsheetRow[] = await this.sheet.rows(Util.capitalize(currency));
		for (let i: number = 0; i < rows.length; i++) {
			if (rows[i]["Name"] === of) {
				return rows[i]["Total"];
			}
		}
		return 0;
	}
}