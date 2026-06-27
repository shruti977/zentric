ALTER TABLE "CareerProfile" ALTER COLUMN "dreamRole" SET DEFAULT 'Your Dream Role';
ALTER TABLE "CareerProfile" ALTER COLUMN "targetCompany" SET DEFAULT 'Your Target Company';

UPDATE "CareerProfile"
SET "dreamRole" = 'Your Dream Role',
    "targetCompany" = 'Your Target Company'
WHERE "dreamRole" = 'Google SDE'
  AND "targetCompany" = 'Google';
