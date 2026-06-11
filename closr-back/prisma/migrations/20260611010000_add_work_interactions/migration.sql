-- AlterTable: replace old "likes" column with normalized counters
ALTER TABLE "Work"
  DROP COLUMN IF EXISTS "likes",
  ADD COLUMN "likeCount"    INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "saveCount"    INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "commentCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable: WorkLike
CREATE TABLE "WorkLike" (
    "id"        TEXT NOT NULL,
    "userId"    TEXT NOT NULL,
    "workId"    TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable: WorkSave
CREATE TABLE "WorkSave" (
    "id"        TEXT NOT NULL,
    "userId"    TEXT NOT NULL,
    "workId"    TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkSave_pkey" PRIMARY KEY ("id")
);

-- CreateTable: WorkComment
CREATE TABLE "WorkComment" (
    "id"        TEXT NOT NULL,
    "content"   TEXT NOT NULL,
    "userId"    TEXT NOT NULL,
    "workId"    TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkComment_pkey" PRIMARY KEY ("id")
);

-- Unique constraints
CREATE UNIQUE INDEX "WorkLike_userId_workId_key"    ON "WorkLike"("userId", "workId");
CREATE UNIQUE INDEX "WorkSave_userId_workId_key"    ON "WorkSave"("userId", "workId");

-- Foreign keys
ALTER TABLE "WorkLike"    ADD CONSTRAINT "WorkLike_userId_fkey"    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WorkLike"    ADD CONSTRAINT "WorkLike_workId_fkey"    FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WorkSave"    ADD CONSTRAINT "WorkSave_userId_fkey"    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WorkSave"    ADD CONSTRAINT "WorkSave_workId_fkey"    FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WorkComment" ADD CONSTRAINT "WorkComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WorkComment" ADD CONSTRAINT "WorkComment_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;
