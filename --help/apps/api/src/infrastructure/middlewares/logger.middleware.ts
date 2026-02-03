import { TRPCMiddleware, MiddlewareOptions } from 'nestjs-trpc';
import { Inject, Injectable, ConsoleLogger } from '@nestjs/common';

const BORDER = '────────────────────────────────────────────────────────';

@Injectable()
export class LoggedMiddleware implements TRPCMiddleware {
    constructor(
        @Inject(ConsoleLogger) private readonly consoleLogger: ConsoleLogger
    ) { }

    private jsonBlock(value: unknown): string {
        if (value === undefined) return '—';
        const str = JSON.stringify(value, null, 2);
        return str.split('\n').map((line) => '  ' + line).join('\n');
    }

    private buildHeader(requestUrl: string, path: string, type: string, durationMs: number, input: unknown): string {
        const lines: string[] = [
            '',
            BORDER,
            '  REQUEST',
            `  ${requestUrl}`,
            '',
            '  META',
            `  path     ${path}`,
            `  type     ${type}`,
            `  duration ${durationMs} ms`,
        ];
        if (input !== undefined && input !== null && Object.keys(input as object).length > 0) {
            lines.push('', '  INPUT', this.jsonBlock(input));
        }
        return lines.join('\n');
    }

    async use(opts: MiddlewareOptions) {
        const start = Date.now();
        const { next, path, type, input } = opts;
        const baseUrl = process.env.TRPC_URL ?? '';
        const requestUrl = `${baseUrl}/${path}`;

        try {
            const result = await next();
            const durationMs = Date.now() - start;
            const header = this.buildHeader(requestUrl, path, type, durationMs, input);

            if (result?.ok === false) {
                const errPayload = result?.error ?? result;
                const log =
                    header +
                    '\n\n  RESPONSE (error)\n' +
                    this.jsonBlock(errPayload) +
                    '\n' + BORDER + '\n';
                this.consoleLogger.error(log);
            } else {
                const payload = result?.data ?? result;
                const log =
                    header +
                    '\n\n  RESPONSE\n' +
                    this.jsonBlock(payload) +
                    '\n' + BORDER + '\n';
                this.consoleLogger.log(log);
            }

            return result;
        } catch (err) {
            const durationMs = Date.now() - start;
            const log =
                this.buildHeader(requestUrl, path, type, durationMs, input) +
                '\n\n  RESPONSE (thrown)\n' +
                this.jsonBlock(err instanceof Error ? { message: err.message, name: err.name } : err) +
                '\n' + BORDER + '\n';
            this.consoleLogger.error('\n' + log);
            throw err;
        }
    }
}