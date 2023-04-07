import { GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { Spreadsheet } from "./Spreadsheet";
import { Timestamp } from "./Timestamp";
import { Util } from "./Util";
import Config = require("./Config");

export class CurrencySystem {
	private sheet: Spreadsheet;

	public constructor(sheet: Spreadsheet) {
		this.sheet = sheet;
	}

	public async add(currency: string, from: string, to: string, amount: number, reason: string): Promise<void> {
		if (currency === "all") {
			for (let i = 0; i < Config.currencies.length; i++) {
				await this.add(Config.currencies[i], from, to, amount, reason);
			}
			return;
		}

		let worksheet: GoogleSpreadsheetWorksheet = await this.sheet.worksheet(Util.capitalize(currency));
		await worksheet.addRow({
			"Awarded By": from,
			"Awarded To": to,
			"Amount": amount,
			"Reason": reason,
			"Time": Timestamp.now()
		});
	}

	public async remove(currency: string, from: string, to: string, amount: number, reason: string): Promise<void> {
		await this.add(currency, from, to, -amount, reason);
	}

	public async balance(currency: string, of: string): Promise<number> {
		let rows: GoogleSpreadsheetRow[] = await this.sheet.rows(Util.capitalize(currency));
		for (let i = 0; i < rows.length; i++) {
			if (rows[i]["Name"] === of) {
				return rows[i]["Total"];
			}
		}
		return 0;
	}
}