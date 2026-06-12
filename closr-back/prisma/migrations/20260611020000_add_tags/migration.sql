-- CreateTable: Tag
CREATE TABLE "Tag" (
    "id"   TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateTable: WorkTag
CREATE TABLE "WorkTag" (
    "workId" TEXT NOT NULL,
    "tagId"  TEXT NOT NULL,
    CONSTRAINT "WorkTag_pkey" PRIMARY KEY ("workId","tagId")
);

ALTER TABLE "WorkTag" ADD CONSTRAINT "WorkTag_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WorkTag" ADD CONSTRAINT "WorkTag_tagId_fkey"  FOREIGN KEY ("tagId")  REFERENCES "Tag"("id")  ON DELETE CASCADE ON UPDATE CASCADE;
