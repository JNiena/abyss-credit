import { GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from "google-spreadsheet";

export class Spreadsheet {

	public static async getRows(spreadSheetID: string, spreadSheetTitle: string, clientEmail: string, privateKey: string): Promise<GoogleSpreadsheetRow[]> {
		return (await this.getSheet(spreadSheetID, spreadSheetTitle, clientEmail, privateKey)).getRows().then();
	}

	public static async getSheet(spreadSheetID: string, spreadSheetTitle: string, clientEmail: string, privateKey: string): Promise<GoogleSpreadsheetWorksheet> {
		let spreadsheet = new GoogleSpreadsheet(spreadSheetID);
		await spreadsheet.useServiceAccountAuth({ client_email: clientEmail, private_key: privateKey });
		await spreadsheet.loadInfo();
		return spreadsheet.sheetsByTitle[spreadSheetTitle];
	}

}