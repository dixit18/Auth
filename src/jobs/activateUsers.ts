import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { sendMail } from '../services/emailService';

const prisma = new PrismaClient();

// Every minute
cron.schedule('* * * * *', async () => {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  try {
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
      console.log(`User ${user.email} activated.`);

      await sendMail({
        to: user.email,
        subject: 'Your account is now active',
        text: `Hello ${user.fullname}, your account has been activated!`,
      });
    }
  } catch (error) {
    console.error('Cron job error:', error);
  }
});