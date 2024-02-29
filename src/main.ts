import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from "express-session"
import * as passport from "passport"
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: "keyboard",
      resave: false,
      saveUninitialized: false,
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transform incoming data to DTO object
    forbidNonWhitelisted: true, // Throws an error if incoming data contains non-whitelisted properties
    whitelist: true, // Strips away non-whitelisted properties
    forbidUnknownValues: true, // Throws an error if incoming data contains unknown properties
    validationError: { target: false },
      }));

app.enableCors()
 
await app.listen(3000);
}
bootstrap();
