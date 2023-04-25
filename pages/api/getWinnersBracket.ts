import { getSheetData } from '@/sheets'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await getSheetData("Winners' Bracket")
    res
      .status(200)
      .json({ data: data, message: "Winners' bracket fetched successfully" })
  } catch (error) {
    let message = 'Unknown Error'
    if (error instanceof Error) message = error.message
    res.status(500).json({ message: message })
  }
}
