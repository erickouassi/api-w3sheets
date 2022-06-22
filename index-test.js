const express = require("express");
const { google } = require("googleapis");

const app = express();
// GOOGLE_SERVICE_ACCOUNT
const mySecret = process.env['Token'];

app.get("/" , async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        //keyFile: "credentials.js",
        credentials: JSON.parse(mySecret),
        // scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });

      // Create client instance for auth
  const client = await auth.getClient();

       // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });


  // Change to your spreadsheet ID
  const spreadsheetId = "1tnyYkbBRb0t0cmg1SZdwZcxWrr_z0M0tYf_WLyi95Pc";

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });
// Read rows from spreadsheet
const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "dataApp", // Change to specific sheet name with the exact name
  });

//console.log(getRows.data.values);

//
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
 console.log(rows);
//

res.send(rows);

// res.send(getRows.data.values);



});


app.listen(1337, (req, res) => console.log("Running on port 1337")); // run nodemon index.js in the terminal & Go to http://127.0.0.1:1337/


// Avoid a single error from crashing the server in production.
process.on("uncaughtException", (...args) => console.error(args));
process.on("unhandledRejection", (...args) => console.error(args));