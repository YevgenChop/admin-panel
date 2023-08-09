const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')

const mockEmail = 'test@test.com'
const mockPassword = '123456'

const projects = [
  {
    createdAt: '2023-07-18T10:15:28.982Z',
    name: 'Watsica - Kunze',
    ssoEnabled: true,
    slackAddonEnabled: true,
    emailsAddonEnabled: true,
  },
  {
    createdAt: '2023-07-18T06:45:19.965Z',
    name: "O'Hara Inc",
    ssoEnabled: false,
    slackAddonEnabled: false,
    emailsAddonEnabled: true,
  },
  {
    createdAt: '2023-07-18T04:55:52.880Z',
    name: 'Wuckert, Aufderhar and Metz',
    ssoEnabled: false,
    slackAddonEnabled: true,
    emailsAddonEnabled: false,
  },
]

async function query({ query, values = [] }) {
  const dbConnection = await mysql.createConnection({
    host: 'localhost',
    database: 'myDB',
    user: 'myUser',
    password: 'myPassword',
  })

  try {
    const [results] = await dbConnection.execute(query, values)
    dbConnection.end()
    return results
  } catch (err) {
    throw Error(err.message)
  }
}

const tableSettings =
  'ENGINE=InnoDB\n' +
  'DEFAULT CHARSET=utf8mb4\n' +
  'COLLATE=utf8mb4_0900_ai_ci;'

async function initializeMockedDatabase() {
  try {
    const usersTable = `CREATE TABLE users (id BIGINT(100) auto_increment NOT NULL, email varchar(100) NOT NULL UNIQUE, password varchar(100) NULL, role varchar(30) DEFAULT 'user'  NOT NULL , project_id BIGINT(50) UNIQUE DEFAULT NULL, PRIMARY KEY (id)) ${tableSettings}`
    await query({
      query: usersTable,
      values: [],
    })

    const projectsTable = `CREATE TABLE projects (id BIGINT(100) auto_increment NOT NULL, name varchar(100) NOT NULL, ssoEnabled BOOL NOT NULL, slackAddonEnabled BOOL NOT NULL, emailsAddonEnabled BOOL NOT NULL, PRIMARY KEY (id), createdAt varchar(30) NOT NULL) ${tableSettings}`
    await query({
      query: projectsTable,
      values: [],
    })
    await query({
      query:
        'ALTER TABLE users ADD FOREIGN KEY (project_id) REFERENCES projects(id)',
      values: [],
    })

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(mockPassword, salt)
    await query({
      query: 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      values: [mockEmail, hashPassword, 'admin'],
    })

    const insertProjects = [
      [
        projects[0].name,
        projects[0].ssoEnabled,
        projects[0].slackAddonEnabled,
        projects[0].emailsAddonEnabled,
        projects[0].createdAt,
      ],
      [
        projects[1].name,
        projects[1].ssoEnabled,
        projects[1].slackAddonEnabled,
        projects[1].emailsAddonEnabled,
        projects[1].createdAt,
      ],
      [
        projects[2].name,
        projects[2].ssoEnabled,
        projects[2].slackAddonEnabled,
        projects[2].emailsAddonEnabled,
        projects[2].createdAt,
      ],
    ]

    const promises = insertProjects.map((project) =>
      query({
        query: `INSERT INTO projects (name, ssoEnabled, slackAddonEnabled, emailsAddonEnabled, createdAt) VALUES (?, ?, ?, ?, ?);`,
        values: project,
      })
    )

    await Promise.all(promises)
  } catch (e) {
    console.log(e.message)
  }
}

initializeMockedDatabase()
