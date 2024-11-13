-- CreateEnum
CREATE TYPE "Status" AS ENUM ('draft', 'published');

-- AlterTable
ALTER TABLE "Contest" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'draft';
