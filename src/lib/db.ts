import mysql from 'mysql2/promise'

export async function query({
  query,
  values = [],
}: {
  query: string
  values: unknown[]
}) {
  const dbConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  })

  try {
    const [results] = await dbConnection.execute(query, values)
    dbConnection.end()
    return results
  } catch (err) {
    throw Error(err.message)
  }
}
