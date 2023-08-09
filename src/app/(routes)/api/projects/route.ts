import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  const projects = await query({
    query: 'SELECT * FROM projects',
    values: [],
  })

  return NextResponse.json({ projects })
}
