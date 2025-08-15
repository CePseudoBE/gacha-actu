-- CreateTable
CREATE TABLE "guides" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT,
    "readingTime" INTEGER,
    "difficulty" TEXT NOT NULL,
    "guideType" TEXT NOT NULL,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "gameId" TEXT NOT NULL,
    "metaDescription" TEXT,
    CONSTRAINT "guides_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "guide_sections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "guideId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "guide_sections_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "guides" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "guide_prerequisites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "guideId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "guide_prerequisites_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "guides" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "guide_tags" (
    "guideId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("guideId", "tagId"),
    CONSTRAINT "guide_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "guide_tags_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "guides" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "guide_seo_keywords" (
    "guideId" TEXT NOT NULL,
    "keywordId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("guideId", "keywordId"),
    CONSTRAINT "guide_seo_keywords_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "seo_keywords" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "guide_seo_keywords_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "guides" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "guides_slug_key" ON "guides"("slug");

-- CreateIndex
CREATE INDEX "guides_gameId_idx" ON "guides"("gameId");

-- CreateIndex
CREATE INDEX "guides_isPopular_idx" ON "guides"("isPopular");

-- CreateIndex
CREATE INDEX "guides_publishedAt_idx" ON "guides"("publishedAt");

-- CreateIndex
CREATE INDEX "guides_difficulty_idx" ON "guides"("difficulty");

-- CreateIndex
CREATE INDEX "guides_guideType_idx" ON "guides"("guideType");

-- CreateIndex
CREATE INDEX "guides_author_idx" ON "guides"("author");

-- CreateIndex
CREATE INDEX "guide_sections_guideId_idx" ON "guide_sections"("guideId");

-- CreateIndex
CREATE INDEX "guide_sections_order_idx" ON "guide_sections"("order");

-- CreateIndex
CREATE INDEX "guide_prerequisites_guideId_idx" ON "guide_prerequisites"("guideId");

-- CreateIndex
CREATE INDEX "guide_tags_guideId_idx" ON "guide_tags"("guideId");

-- CreateIndex
CREATE INDEX "guide_tags_tagId_idx" ON "guide_tags"("tagId");

-- CreateIndex
CREATE INDEX "guide_seo_keywords_guideId_idx" ON "guide_seo_keywords"("guideId");

-- CreateIndex
CREATE INDEX "guide_seo_keywords_keywordId_idx" ON "guide_seo_keywords"("keywordId");
