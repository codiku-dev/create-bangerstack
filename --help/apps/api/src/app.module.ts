import { Module } from '@nestjs/common';
import * as path from 'path';

import { UsersModule } from '@api/src/features/users/users.module';
import { PrismaModule } from '@api/src/infrastructure/prisma/prisma.module';

import { AppService } from '@api/src/app.service';
import { TRPCModule } from 'nestjs-trpc';
import { AppRouter } from '@api/src/app.router';
import { TrpcMiddlewaresModule } from '@api/src/infrastructure/middlewares/trpc-middlewares.module';
import { PublicPathScannerService, TRPC_ROUTER_TYPES } from '@api/src/infrastructure/middlewares/public-path-scanner.service';
import { UserRouter } from '@api/src/features/users/users.router';
import { TrpcPanelController } from '@api/src/infrastructure/docs/docs.controller';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@api/src/infrastructure/auth/auth';
// Relative path so nestjs-trpc generator can resolve the context (it doesn't use path aliases)
import { AppContext } from './infrastructure/trpc/app-context';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    TrpcMiddlewaresModule,
    TRPCModule.forRoot({
      autoSchemaFile: path.resolve(__dirname, '../../../../packages/trpc/src'),
      context: AppContext,
    }),
    AuthModule.forRoot({ auth, disableTrustedOriginsCors: true }),
  ],
  controllers: [TrpcPanelController],
  providers: [
    AppService,
    AppRouter,
    AppContext,
    { provide: TRPC_ROUTER_TYPES, useValue: [AppRouter, UserRouter] },
    PublicPathScannerService,
  ],
}) export class AppModule { }