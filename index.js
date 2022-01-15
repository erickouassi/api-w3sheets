const express = require('express');
const { google } = require("googleapis");

const app = express();
// GOOGLE_SERVICE_ACCOUNT
const mySecret = process.env['Token'];

//Redirect to different URL
//app.get("/", async (req, res) => {
//  res.redirect("https://w3sheets.cf/");
//});

app.get('/', (req, res) => {
	res.send('API is ACTIVE');
});

app.get('/:start/:end', async function (req, res) {
	//console.log("Starting Page: ", req.params['start']);
	//console.log("Ending Page: ", req.params['end']);

    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(mySecret),
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });
	
          // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
const googleSheets = google.sheets({ version: "v4", auth: client });

  // Change to your spreadsheet ID
  const spreadsheetId = req.params['start'];
  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });
// Read rows from spreadsheet
const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: req.params['end'],
  });
  const rows = [];

  const rawRows = getRows.data.values || [];
  const headers = rawRows.shift();

  rawRows.forEach((row) => {
    const rowData = {};
    row.forEach((item, index) => {
      rowData[headers[index]] = item;
    });
    rows.push(rowData);
  });
//console.log(rows);

res.send(rows);
});


app.listen(1337, (req, res) => console.log("running on 1337")); // run nodemon index.js in the terminal: http://127.0.0.1:1337/

// Avoid a single error from crashing the server in production.
process.on("uncaughtException", (...args) => console.error(args));
process.on("unhandledRejection", (...args) => console.error(args));
