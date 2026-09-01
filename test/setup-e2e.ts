import { config } from "dotenv"

import { randomUUID } from "node:crypto"
import { execSync } from "node:child_process"
import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "@/generated/prisma/client"

import { DomainEvents } from "@/core/events/domain-events"

config({ path: ".env", override: true })
config({ path: ".env.test", override: true })

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provider a DATABASE_URL environment variable.")
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set("schema", schemaId)

  return url.toString()
}

const randomSchemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(randomSchemaId)

  process.env.DATABASE_URL = databaseURL

  DomainEvents.shouldRun = false

  execSync("npx prisma migrate deploy")
}, 20000)

afterAll(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${randomSchemaId}" CASCADE`,
  )

  await prisma.$disconnect()
})
