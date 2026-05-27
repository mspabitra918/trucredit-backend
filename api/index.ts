import 'reflect-metadata';
import 'dotenv/config';

// Sequelize loads its Postgres driver through a dynamic require(), which
// Vercel's file tracer cannot detect. Import them statically here so they get
// bundled into the serverless function ("Please install pg package manually").
import 'pg';
import 'pg-hstore';

import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import express, { NextFunction, Request, Response } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';

let cachedApp: express.Express | undefined;

async function bootstrap(): Promise<express.Express> {
  const expressApp = express();

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://lendingfinance.site',
      'https://www.lendingfinance.site',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.disable('etag');
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Postgres API')
    .setDescription('API with NestJS + Sequelize + PostgreSQL')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init();
  return expressApp;
}

export default async function handler(req: Request, res: Response) {
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }
  return cachedApp(req, res);
}
