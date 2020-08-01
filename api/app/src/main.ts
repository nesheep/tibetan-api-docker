import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Content-Type, Origin, Authorization');
    res.header('Access-Control-Max-Age', '3600');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200)
    } else {
      next()
    }
  });
  await app.listen(3000);
}
bootstrap();
