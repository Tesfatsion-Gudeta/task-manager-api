import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Helmet security
  app.use(
    helmet({
      // Content Security Policy helps prevent XSS attacks
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`], // Only allow resources from same origin
          styleSrc: [`'self'`, `'unsafe-inline'`], // Allow inline styles (needed for Swagger)
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'], // Allow images from self, data URIs, and Swagger
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`], // Allow scripts from self and inline (Swagger needs this)
        },
      },
      // Disable crossOriginEmbedderPolicy for Swagger compatibility
      crossOriginEmbedderPolicy: false,
    }),
  );

  // cors config
  app.enableCors({
    origin: ['http://localhost:8080', 'http://localhost:3000'], // Allowed frontend origins
    credentials: true, // Allows cookies and authorization headers to be sent
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Explicitly allowed headers
  });

  // middlware for cookie parsing, requried for refresh token handling
  app.use(cookieParser());

  //global validation pipe, that automatically validates incoming data
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators in DTOs
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are sent
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Swagger configuration for API documentation
  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription(
      'Comprehensive API documentation for the Task Manager system, including authentication, projects, and tasks management.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http', // Authentication type
        scheme: 'bearer', // Authentication scheme
        bearerFormat: 'JWT', // Token format
      },
      'access_token', // Security scheme name
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep authorization token between browser refreshes
    },
  });

  await app.listen(process.env.PORT ?? 3001);

  // Log server information
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`API Documentation available at: ${await app.getUrl()}/api/docs`);
}

// Start the application
bootstrap();
