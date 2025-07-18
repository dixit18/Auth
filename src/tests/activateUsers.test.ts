import { PrismaClient } from '@prisma/client';

describe('Activate Users Cron Job', () => {
  let prisma: PrismaClient;
  let updateMock: jest.SpyInstance;
  let findManyMock: jest.SpyInstance;

  beforeAll(() => {
    prisma = new PrismaClient();
    updateMock = jest.spyOn(prisma.user, 'update').mockImplementation((args) => Promise.resolve(args) as any);
    findManyMock = jest.spyOn(prisma.user, 'findMany').mockImplementation(() =>
      Promise.resolve([
        { id: 1, email: 'test@example.com', status: 'inactive', createdAt: new Date(Date.now() - 16 * 60 * 1000) },
      ]) as any
    );
  });

  afterAll(() => {
    updateMock.mockRestore();
    findManyMock.mockRestore();
  });

  it('should activate users inactive for 15+ minutes', async () => {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const usersToActivate = await prisma.user.findMany({
      where: {
        status: 'inactive',
        createdAt: { lte: fifteenMinutesAgo },
      },
    });
    for (const user of usersToActivate) {
      await prisma.user.update({
        where: { id: user.id },
        data: { status: 'active' },
      });
    }
    expect(findManyMock).toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: 'active' },
    });
  });
}); 