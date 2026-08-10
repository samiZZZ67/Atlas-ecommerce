import app from './app';
import config from './config';
import prisma from './config/prisma';

const PORT = config.port;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected.');

    app.listen(PORT, () => {
      console.log(`🚀 ATLAS API running on port ${PORT} [${config.nodeEnv}]`);
      console.log(`   Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Server shut down.');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
