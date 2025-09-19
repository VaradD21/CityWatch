const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mock data for testing
const testUser = {
  id: 'test-user-1',
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashedpassword',
  role: 'citizen',
  cityId: 'test-city-1',
  isVerified: true
};

const testReport = {
  id: 'test-report-1',
  title: 'Test Report',
  description: 'Test Description',
  category: 'OTHER',
  status: 'OPEN',
  cityId: 'test-city-1',
  authorId: 'test-user-1',
  priorityCount: 0
};

const testCity = {
  id: 'test-city-1',
  name: 'Test City',
  slug: 'test-city'
};

describe('Priority Voting System', () => {
  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.reportPriorityVote.deleteMany({
      where: {
        OR: [
          { userId: testUser.id },
          { reportId: testReport.id }
        ]
      }
    });
    
    await prisma.report.deleteMany({
      where: { id: testReport.id }
    });
    
    await prisma.user.deleteMany({
      where: { id: testUser.id }
    });
    
    await prisma.city.deleteMany({
      where: { id: testCity.id }
    });

    // Create test data
    await prisma.city.create({ data: testCity });
    await prisma.user.create({ data: testUser });
    await prisma.report.create({ data: testReport });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.reportPriorityVote.deleteMany({
      where: {
        OR: [
          { userId: testUser.id },
          { reportId: testReport.id }
        ]
      }
    });
    
    await prisma.report.deleteMany({
      where: { id: testReport.id }
    });
    
    await prisma.user.deleteMany({
      where: { id: testUser.id }
    });
    
    await prisma.city.deleteMany({
      where: { id: testCity.id }
    });
    
    await prisma.$disconnect();
  });

  describe('Priority Vote Creation', () => {
    test('should create a priority vote and increment count', async () => {
      // Create a priority vote
      const vote = await prisma.reportPriorityVote.create({
        data: {
          reportId: testReport.id,
          userId: testUser.id
        }
      });

      expect(vote).toBeDefined();
      expect(vote.reportId).toBe(testReport.id);
      expect(vote.userId).toBe(testUser.id);

      // Update report priority count
      const updatedReport = await prisma.report.update({
        where: { id: testReport.id },
        data: {
          priorityCount: {
            increment: 1
          }
        }
      });

      expect(updatedReport.priorityCount).toBe(1);
    });

    test('should prevent duplicate votes', async () => {
      // Try to create a duplicate vote
      await expect(
        prisma.reportPriorityVote.create({
          data: {
            reportId: testReport.id,
            userId: testUser.id
          }
        })
      ).rejects.toThrow();
    });
  });

  describe('Priority Vote Removal', () => {
    test('should remove a priority vote and decrement count', async () => {
      // Remove the priority vote
      await prisma.reportPriorityVote.delete({
        where: {
          reportId_userId: {
            reportId: testReport.id,
            userId: testUser.id
          }
        }
      });

      // Update report priority count
      const updatedReport = await prisma.report.update({
        where: { id: testReport.id },
        data: {
          priorityCount: {
            decrement: 1
          }
        }
      });

      expect(updatedReport.priorityCount).toBe(0);
    });
  });

  describe('Report Sorting by Priority', () => {
    test('should sort reports by priority count', async () => {
      // Create additional test reports with different priority counts
      const report2 = await prisma.report.create({
        data: {
          id: 'test-report-2',
          title: 'Low Priority Report',
          description: 'Description',
          category: 'OTHER',
          status: 'OPEN',
          cityId: testCity.id,
          authorId: testUser.id,
          priorityCount: 1
        }
      });

      const report3 = await prisma.report.create({
        data: {
          id: 'test-report-3',
          title: 'High Priority Report',
          description: 'Description',
          category: 'OTHER',
          status: 'OPEN',
          cityId: testCity.id,
          authorId: testUser.id,
          priorityCount: 5
        }
      });

      // Fetch reports ordered by priority
      const reports = await prisma.report.findMany({
        where: {
          cityId: testCity.id,
          deleted: false
        },
        orderBy: [
          { priorityCount: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      // Should be ordered by priority count (highest first)
      expect(reports[0].priorityCount).toBeGreaterThanOrEqual(reports[1].priorityCount);
      expect(reports[1].priorityCount).toBeGreaterThanOrEqual(reports[2].priorityCount);

      // Clean up
      await prisma.report.deleteMany({
        where: {
          id: { in: [report2.id, report3.id] }
        }
      });
    });
  });
});
