import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  const users = await query({
    query: `SELECT id, email, role FROM users WHERE role!='admin'`,
    values: [],
  })

  return NextResponse.json({ users })
}

export async function POST(req: Request) {
  const requestData = await req.json()
  const { email, projectId } = requestData
  const user = await query({
    query: `INSERT INTO users (email, role, project_id) VALUES (?, ?, ?)`,
    values: [email, 'user', projectId],
  })

  return NextResponse.json({ user })
}
