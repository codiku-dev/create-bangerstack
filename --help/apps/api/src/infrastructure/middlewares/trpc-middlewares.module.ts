import { ConsoleLogger, Global, Module } from '@nestjs/common';
import { LoggedMiddleware } from '@api/src/infrastructure/middlewares/logger.middleware';
import { AuthGuardMiddleware } from '@api/src/infrastructure/middlewares/auth-guard.middleware';
import { PublicProcedureMiddleware } from '@api/src/infrastructure/middlewares/public-procedure.middleware';

@Global()
@Module({
  providers: [
    ConsoleLogger,
    LoggedMiddleware,
    AuthGuardMiddleware,
    PublicProcedureMiddleware,
  ],
  exports: [
    LoggedMiddleware,
    AuthGuardMiddleware,
    PublicProcedureMiddleware,
  ],
})
export class TrpcMiddlewaresModule { }
