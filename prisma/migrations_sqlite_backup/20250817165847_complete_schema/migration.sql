/*
  Warnings:

  - You are about to drop the column `platform` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `guides` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "platforms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "game_platforms" (
    "gameId" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("gameId", "platformId"),
    CONSTRAINT "game_platforms_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "game_platforms_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "platforms" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" DATETIME,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastLoginAt" DATETIME
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "maintenance_settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT NOT NULL DEFAULT 'Site en maintenance. Nous reviendrons bientôt !',
    "estimatedEndTime" DATETIME,
    "allowAdminAccess" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "enabledBy" TEXT,
    "disabledBy" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_games" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "genre" TEXT,
    "developer" TEXT,
    "releaseDate" TEXT,
    "imageUrl" TEXT,
    "logoUrl" TEXT,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "officialSite" TEXT,
    "wiki" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_games" ("createdAt", "description", "developer", "genre", "id", "imageUrl", "isPopular", "logoUrl", "name", "officialSite", "releaseDate", "slug", "updatedAt", "wiki") SELECT "createdAt", "description", "developer", "genre", "id", "imageUrl", "isPopular", "logoUrl", "name", "officialSite", "releaseDate", "slug", "updatedAt", "wiki" FROM "games";
DROP TABLE "games";
ALTER TABLE "new_games" RENAME TO "games";
CREATE UNIQUE INDEX "games_name_key" ON "games"("name");
CREATE UNIQUE INDEX "games_slug_key" ON "games"("slug");
CREATE INDEX "games_isPopular_idx" ON "games"("isPopular");
CREATE INDEX "games_genre_idx" ON "games"("genre");
CREATE TABLE "new_guides" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
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
INSERT INTO "new_guides" ("author", "createdAt", "difficulty", "gameId", "guideType", "id", "imageUrl", "isPopular", "metaDescription", "publishedAt", "readingTime", "slug", "summary", "title", "updatedAt", "viewCount") SELECT "author", "createdAt", "difficulty", "gameId", "guideType", "id", "imageUrl", "isPopular", "metaDescription", "publishedAt", "readingTime", "slug", "summary", "title", "updatedAt", "viewCount" FROM "guides";
DROP TABLE "guides";
ALTER TABLE "new_guides" RENAME TO "guides";
CREATE UNIQUE INDEX "guides_slug_key" ON "guides"("slug");
CREATE INDEX "guides_gameId_idx" ON "guides"("gameId");
CREATE INDEX "guides_isPopular_idx" ON "guides"("isPopular");
CREATE INDEX "guides_publishedAt_idx" ON "guides"("publishedAt");
CREATE INDEX "guides_difficulty_idx" ON "guides"("difficulty");
CREATE INDEX "guides_guideType_idx" ON "guides"("guideType");
CREATE INDEX "guides_author_idx" ON "guides"("author");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "platforms_name_key" ON "platforms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "platforms_slug_key" ON "platforms"("slug");

-- CreateIndex
CREATE INDEX "game_platforms_gameId_idx" ON "game_platforms"("gameId");

-- CreateIndex
CREATE INDEX "game_platforms_platformId_idx" ON "game_platforms"("platformId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");
