-- CreateTable
CREATE TABLE "repo_chunk" (
    "namespace" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repo_chunk_pkey" PRIMARY KEY ("namespace","id")
);

-- CreateIndex
CREATE INDEX "repo_chunk_namespace_idx" ON "repo_chunk"("namespace");
