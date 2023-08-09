import { NextRequest, NextResponse } from 'next/server'
import { verify } from '@/lib/jwt'
export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  if (!req.nextUrl.pathname.startsWith('/api/')) {
    const cookies = req.cookies.get('jwt')

    if (req.nextUrl.pathname.startsWith('/login') && !Boolean(cookies)) {
      return NextResponse.next()
    }

    if (Boolean(cookies)) {
      return NextResponse.next()
    }

    return new NextResponse('Cannot access this endpoint with ' + req.method, {
      status: 400,
    })
  }

  if (req.nextUrl.pathname == '/api/login') {
    return NextResponse.next()
  }

  const cookies = req.cookies.get('jwt')

  if (!cookies) {
    return new NextResponse('Cannot access this endpoint with ' + req.method, {
      status: 400,
    })
  }

  try {
    const decoded = await verify(cookies.value, process.env.JWT_SECRET_KEY)

    if (!decoded) {
      return new NextResponse(
        'Cannot access this endpoint with ' + req.method,
        { status: 400 }
      )
    }

    if (req.nextUrl.pathname === '/api/me') {
      return NextResponse.json({
        user: {
          ...decoded,
        },
      })
    }

    if (req.nextUrl.pathname === '/api/user') {
      if (req.method === 'POST' && decoded.role !== 'admin') {
        return new NextResponse(
          'Cannot access this endpoint with ' + req.method,
          { status: 400 }
        )
      }

      return NextResponse.next()
    }
  } catch (err) {
    console.log(err)
    return new NextResponse('Cannot access this endpoint with ' + req.method, {
      status: 400,
    })
  }

  return NextResponse.next()
}
