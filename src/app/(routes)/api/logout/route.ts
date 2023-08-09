import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  cookies().delete('jwt')

  return NextResponse.json({}, { status: 200 })
}
