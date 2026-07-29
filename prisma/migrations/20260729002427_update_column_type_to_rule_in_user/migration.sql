/*
  Warnings:

  - You are about to drop the column `type` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DELIVERY_PERSON', 'ADMIN');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "type",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'DELIVERY_PERSON';

-- DropEnum
DROP TYPE "UserType";
