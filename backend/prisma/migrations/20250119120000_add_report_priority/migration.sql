-- Add priorityCount column to reports table
ALTER TABLE "reports" ADD COLUMN "priorityCount" INTEGER NOT NULL DEFAULT 0;

-- Create report_priority_votes table
CREATE TABLE "report_priority_votes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "report_priority_votes_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "report_priority_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create unique constraint to prevent duplicate votes
CREATE UNIQUE INDEX "report_priority_votes_reportId_userId_key" ON "report_priority_votes"("reportId", "userId");

-- Create indexes for performance
CREATE INDEX "report_priority_votes_reportId_idx" ON "report_priority_votes"("reportId");
CREATE INDEX "report_priority_votes_userId_idx" ON "report_priority_votes"("userId");
CREATE INDEX "report_priority_votes_createdAt_idx" ON "report_priority_votes"("createdAt");
CREATE INDEX "reports_priorityCount_idx" ON "reports"("priorityCount");
