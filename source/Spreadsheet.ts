import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from 'google-auth-library';

export class Spreadsheet {
	private sheet: GoogleSpreadsheet;
	private auth: JWT;

	public constructor(id: string, clientEmail: string, privateKey: string) {
		this.auth = new JWT({ "email": clientEmail, "key": privateKey.split(String.raw`\n`).join("\n"), "scopes": ["https://www.googleapis.com/auth/spreadsheets"] });
		this.sheet = new GoogleSpreadsheet(id, this.auth);
	}

	public async worksheet(title: string) {
		await this.sheet.loadInfo();
		return this.sheet.sheetsByTitle[title];
	}

	public async rows(title: string) {
		return (await this.worksheet(title)).getRows().then();
	}
}