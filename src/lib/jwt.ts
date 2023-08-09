import { SignJWT, jwtVerify } from 'jose'

export async function verify(
  token: string,
  secret: string
): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
  return payload
}

export async function sign(
  payload: Record<string, unknown>,
  secret: string
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .sign(new TextEncoder().encode(secret))
}
