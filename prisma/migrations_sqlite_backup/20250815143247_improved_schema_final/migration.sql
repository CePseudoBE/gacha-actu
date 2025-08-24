/*
  Warnings:

  - You are about to alter the column `publishedAt` on the `articles` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - Added the required column `updatedAt` to the `seo_keywords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_article_seo_keywords" (
    "articleId" TEXT NOT NULL,
    "keywordId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("articleId", "keywordId"),
    CONSTRAINT "article_seo_keywords_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "article_seo_keywords_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "seo_keywords" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_article_seo_keywords" ("articleId", "keywordId") SELECT "articleId", "keywordId" FROM "article_seo_keywords";
DROP TABLE "article_seo_keywords";
ALTER TABLE "new_article_seo_keywords" RENAME TO "article_seo_keywords";
CREATE INDEX "article_seo_keywords_articleId_idx" ON "article_seo_keywords"("articleId");
CREATE INDEX "article_seo_keywords_keywordId_idx" ON "article_seo_keywords"("keywordId");
CREATE TABLE "new_article_tags" (
    "articleId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("articleId", "tagId"),
    CONSTRAINT "article_tags_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "article_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_article_tags" ("articleId", "tagId") SELECT "articleId", "tagId" FROM "article_tags";
DROP TABLE "article_tags";
ALTER TABLE "new_article_tags" RENAME TO "article_tags";
CREATE INDEX "article_tags_articleId_idx" ON "article_tags"("articleId");
CREATE INDEX "article_tags_tagId_idx" ON "article_tags"("tagId");
CREATE TABLE "new_articles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT,
    "content" TEXT NOT NULL,
    "metaDescription" TEXT,
    "readingTime" INTEGER,
    "category" TEXT,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "gameId" TEXT NOT NULL,
    CONSTRAINT "articles_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_articles" ("author", "category", "content", "createdAt", "gameId", "id", "imageUrl", "isPopular", "metaDescription", "publishedAt", "readingTime", "slug", "summary", "title", "updatedAt") SELECT "author", "category", "content", "createdAt", "gameId", "id", "imageUrl", "isPopular", "metaDescription", "publishedAt", "readingTime", "slug", "summary", "title", "updatedAt" FROM "articles";
DROP TABLE "articles";
ALTER TABLE "new_articles" RENAME TO "articles";
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");
CREATE INDEX "articles_gameId_idx" ON "articles"("gameId");
CREATE INDEX "articles_isPopular_idx" ON "articles"("isPopular");
CREATE INDEX "articles_publishedAt_idx" ON "articles"("publishedAt");
CREATE INDEX "articles_category_idx" ON "articles"("category");
CREATE INDEX "articles_author_idx" ON "articles"("author");
CREATE TABLE "new_game_tags" (
    "gameId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("gameId", "tagId"),
    CONSTRAINT "game_tags_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "game_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_game_tags" ("gameId", "tagId") SELECT "gameId", "tagId" FROM "game_tags";
DROP TABLE "game_tags";
ALTER TABLE "new_game_tags" RENAME TO "game_tags";
CREATE INDEX "game_tags_gameId_idx" ON "game_tags"("gameId");
CREATE INDEX "game_tags_tagId_idx" ON "game_tags"("tagId");
CREATE TABLE "new_seo_keywords" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "keyword" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_seo_keywords" ("createdAt", "id", "keyword") SELECT "createdAt", "id", "keyword" FROM "seo_keywords";
DROP TABLE "seo_keywords";
ALTER TABLE "new_seo_keywords" RENAME TO "seo_keywords";
CREATE UNIQUE INDEX "seo_keywords_keyword_key" ON "seo_keywords"("keyword");
CREATE TABLE "new_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_tags" ("createdAt", "id", "name", "slug") SELECT "createdAt", "id", "name", "slug" FROM "tags";
DROP TABLE "tags";
ALTER TABLE "new_tags" RENAME TO "tags";
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "games_isPopular_idx" ON "games"("isPopular");

-- CreateIndex
CREATE INDEX "games_genre_idx" ON "games"("genre");
