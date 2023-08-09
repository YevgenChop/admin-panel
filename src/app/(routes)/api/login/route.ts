import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { checkPassword } from '@/lib/cript'
import { sign } from '@/lib/jwt'

export async function POST(req: Request) {
  const requestData = await req.json()
  const { email, password } = requestData

  const [user] = await query({
    query: `SELECT * FROM users WHERE email=?`,
    values: [email],
  })

  if (!user) {
    return NextResponse.json({ error: 'User does not exist' }, { status: 401 })
  }

  if (user.password === null) {
    return NextResponse.json({ error: 'User not verified.' }, { status: 401 })
  }

  const isEqual = await checkPassword(password, user.password)

  if (!isEqual) {
    return NextResponse.json({ error: 'Bad request.' }, { status: 401 })
  }

  const resUser = {
    id: user.id,
    email: user.email,
    role: user.role,
  }
  const response = NextResponse.json({
    user: resUser,
  })

  const token = await sign(resUser, process.env.JWT_SECRET_KEY)

  response.cookies.set({
    name: 'jwt',
    value: token,
    httpOnly: true,
  })

  return response
}
