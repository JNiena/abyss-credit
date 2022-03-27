"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spreadsheet = void 0;
const google_spreadsheet_1 = require("google-spreadsheet");
class Spreadsheet {
    static async getRows(spreadSheetID, clientEmail, privateKey) {
        return (await this.getSheet(spreadSheetID, clientEmail, privateKey)).getRows().then();
    }
    static async getSheet(spreadSheetID, clientEmail, privateKey) {
        let spreadsheet = new google_spreadsheet_1.GoogleSpreadsheet(spreadSheetID);
        await spreadsheet.useServiceAccountAuth({ client_email: clientEmail, private_key: privateKey });
        await spreadsheet.loadInfo();
        return spreadsheet.sheetsByIndex[0];
    }
}
exports.Spreadsheet = Spreadsheet;
