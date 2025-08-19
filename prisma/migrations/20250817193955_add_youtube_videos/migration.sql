-- CreateTable
CREATE TABLE "youtube_videos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "videoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "channelTitle" TEXT,
    "publishedAt" DATETIME,
    "category" TEXT,
    "duration" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "gameId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "youtube_videos_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "youtube_videos_videoId_key" ON "youtube_videos"("videoId");

-- CreateIndex
CREATE INDEX "youtube_videos_isActive_idx" ON "youtube_videos"("isActive");

-- CreateIndex
CREATE INDEX "youtube_videos_order_idx" ON "youtube_videos"("order");

-- CreateIndex
CREATE INDEX "youtube_videos_publishedAt_idx" ON "youtube_videos"("publishedAt");

-- CreateIndex
CREATE INDEX "youtube_videos_gameId_idx" ON "youtube_videos"("gameId");

-- CreateIndex
CREATE INDEX "youtube_videos_category_idx" ON "youtube_videos"("category");
