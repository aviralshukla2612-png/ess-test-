require('dotenv').config();
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./app.module');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Prefix /api
  app.setGlobalPrefix('api');

  // CORS Configuration
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`=======================================================`);
  console.log(`🚀 Emperor Smart Solutions Assessment API Running`);
  console.log(`🌐 API Endpoint: http://localhost:${port}/api`);
  console.log(`🔒 Admin Auth: POST http://localhost:${port}/api/auth/login`);
  console.log(`=======================================================`);
}

bootstrap();
