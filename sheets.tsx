import { google } from 'googleapis'

export async function getSheetData(sheetName: string) {
  try {
    const target = ['https://www.googleapis.com/auth/spreadsheets.readonly']
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      undefined,
      (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      target
    )

    const sheets = google.sheets({ version: 'v4', auth: jwt })
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: sheetName,
    })

    const rows = response.data.values!.slice(1)
    var formattedRows
    if (
      ["Winners' Bracket", "Losers' Bracket", 'Other Games'].includes(sheetName)
    ) {
      formattedRows = rows.map((row) => {
        return {
          team1Name: row[0],
          team1Points: row[1],
          team2Name: row[2],
          team2Points: row[3],
          isFinished: row[4],
          description: row[5],
        }
      })
    } else if (['Teams'].includes(sheetName)) {
      formattedRows = rows.map((row) => {
        return { name: row[0], players: row.slice(1) }
      })
    }

    return formattedRows
  } catch (error) {
    throw error
  }
}
