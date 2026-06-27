CREATE TABLE "StudyPracticeProgress" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "studyTopicId" TEXT NOT NULL,

    CONSTRAINT "StudyPracticeProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "StudyPracticeProgress_userId_studyTopicId_questionId_key" ON "StudyPracticeProgress"("userId", "studyTopicId", "questionId");
CREATE INDEX "StudyPracticeProgress_studyTopicId_idx" ON "StudyPracticeProgress"("studyTopicId");

ALTER TABLE "StudyPracticeProgress" ADD CONSTRAINT "StudyPracticeProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudyPracticeProgress" ADD CONSTRAINT "StudyPracticeProgress_studyTopicId_fkey" FOREIGN KEY ("studyTopicId") REFERENCES "StudyTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
