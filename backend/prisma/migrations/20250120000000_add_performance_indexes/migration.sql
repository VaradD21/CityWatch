-- CreateIndex
CREATE INDEX "reports_priorityCount_createdAt_idx" ON "reports"("priorityCount", "createdAt");

-- CreateIndex
CREATE INDEX "reports_status_cityId_createdAt_idx" ON "reports"("status", "cityId", "createdAt");

-- CreateIndex
CREATE INDEX "reports_cityId_category_status_idx" ON "reports"("cityId", "category", "status");
