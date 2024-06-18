"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendSpreadSheetValues = exports.getSpreadSheetValues = exports.getSpreadSheet = exports.getAuthToken = void 0;
const { google } = require("googleapis");
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
require('dotenv').config();
console.log("GOOGLE_APPLICATION_CREDENTIALS: ", process.env.GOOGLE_APPLICATION_CREDENTIALS);
const auth = new google.auth.GoogleAuth({
    // keyFile: `/etc/secrets/${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
    keyFile: `./${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
    // keyFile: `../${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
    scopes: SCOPES,
});
const sheets = google.sheets({ version: "v4", auth });
function getAuthToken() {
    return __awaiter(this, void 0, void 0, function* () {
        // const auth = new google.auth.GoogleAuth({ // temporary commented
        //   scopes: SCOPES,
        // });
        const authToken = yield auth.getClient();
        return authToken;
    });
}
exports.getAuthToken = getAuthToken;
function getSpreadSheet(auth, spreadsheetId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield sheets.spreadsheets.get({
            spreadsheetId,
            auth,
        });
        return res;
    });
}
exports.getSpreadSheet = getSpreadSheet;
function getSpreadSheetValues(auth, spreadsheetId, sheetName) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield sheets.spreadsheets.values.get({
            spreadsheetId,
            auth,
            range: sheetName,
        });
        return res;
    });
}
exports.getSpreadSheetValues = getSpreadSheetValues;
function appendSpreadSheetValues(auth, spreadsheetId, sheetName, values) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield sheets.spreadsheets.values.append({
            spreadsheetId,
            auth,
            range: sheetName,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [values], // values should be an array of strings
            },
        });
        return res;
    });
}
exports.appendSpreadSheetValues = appendSpreadSheetValues;
