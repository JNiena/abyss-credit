import {GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet} from "google-spreadsheet";

export class Spreadsheet {
	private sheet: GoogleSpreadsheet;
	private clientEmail: string;
	private privateKey: string;

	public constructor(id: string, clientEmail: string, privateKey: string) {
		this.sheet = new GoogleSpreadsheet(id);
		this.clientEmail = clientEmail;
		this.privateKey = privateKey.split(String.raw`\n`).join("\n");
	}

	public async worksheet(title: string): Promise<GoogleSpreadsheetWorksheet> {
		await this.sheet.useServiceAccountAuth({client_email: this.clientEmail, private_key: this.privateKey});
		await this.sheet.loadInfo();
		return this.sheet.sheetsByTitle[title];
	}

	public async rows(title: string): Promise<GoogleSpreadsheetRow[]> {
		return (await this.worksheet(title)).getRows().then();
	}
}