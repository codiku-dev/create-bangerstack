import { PrismaService } from '@api/src/infrastructure/prisma/prisma.service';
import { Query, Router } from 'nestjs-trpc';
import { Inject } from '@nestjs/common';
import { z } from 'zod';
import { AuthGuard } from '@api/src/infrastructure/decorators/auth/auth-guard.decorator';
import { Public } from '@api/src/infrastructure/decorators/auth/public-procedure.decorator';

@Router({ alias: 'app' })
@AuthGuard({ logs: true })
export class AppRouter {
    constructor(@Inject(PrismaService) private db: PrismaService) { }

    @Public()
    @Query({ output: z.object({ message: z.string() }) })
    async hello() {
        return { message: `Hello from public route at ${new Date().toISOString()}` };
    }

    @Query({ output: z.object({ message: z.string() }) })
    async protectedHello() {
        return { message: `Hello, you are authenticated (${new Date().toISOString()})` };
    }

    @Query({ output: z.object({ message: z.string() }) })
    async demoHello() {
        return { message: `Hello, you are authenticated (${new Date().toISOString()})` };
    }

    @Public()
    @Query({ output: z.object({ message: z.string() }) })
    async other() {
        return { message: `Hello, you are public (${new Date().toISOString()})` };
    }
}