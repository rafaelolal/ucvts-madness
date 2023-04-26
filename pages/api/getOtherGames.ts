import { getSheetData } from '@/sheets'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await getSheetData('Other Games')
    res
      .status(200)
      .json({ data: data, message: 'Other Games fetched successfully' })
  } catch (error) {
    let message = 'Unknown Error'
    if (error instanceof Error) message = error.message
    console.log({ error })
    res.status(500).json({ message: message })
  }
}
