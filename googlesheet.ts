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
const sheets = google.sheets({version:"v4", auth});


export async function getAuthToken() {
  // const auth = new google.auth.GoogleAuth({ // temporary commented
  //   scopes: SCOPES,
  // });
  const authToken = await auth.getClient();
  return authToken;
}

export async function getSpreadSheet(auth: any, spreadsheetId: any) {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res;
}

export async function getSpreadSheetValues(
  auth: any,
  spreadsheetId: any,
  sheetName: any
) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName,
  });
  return res;
}

export async function appendSpreadSheetValues(auth: any, spreadsheetId: any, sheetName: any, values: any[]) {
    const res = await sheets.spreadsheets.values.append({
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
  }
