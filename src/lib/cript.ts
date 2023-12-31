const bcrypt = require('bcrypt')

const saltRounds = 10
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(saltRounds)
  return await bcrypt.hash(password, salt)
}

export function checkPassword(password: string, hashPassword: string) {
  return bcrypt.compare(password, hashPassword)
}
