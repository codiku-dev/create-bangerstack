'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@repo/ui/badge/badge';

export function EnvStep() {
  const t4 = useTranslations('Landing.step4');

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
        <div className="flex flex-col min-h-0">
          <h3 className="text-lg font-semibold mb-4 text-zinc-200">{t4('stronglyTypeEnv')}</h3>
          <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 flex-1 flex flex-col min-h-0">
            <div className="bg-gray-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 min-w-0 border-b border-gray-700 shrink-0">
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-[10px] sm:text-xs text-gray-400 truncate" title="apps/api/env-type.ts">apps/api/env-type.ts</span>
              </div>
              <Badge size="sm">{t4('zodSchemaBadge')}</Badge>
            </div>
            <div className="p-6 overflow-x-auto flex-1 min-h-0">
              <pre className="text-xs sm:text-sm font-mono leading-relaxed text-gray-300">
                <code>
                  <span className="text-purple-400">import</span>
                  <span className="text-gray-300">{' { z } '}</span>
                  <span className="text-purple-400">from</span>
                  <span className="text-yellow-400"> {'\'zod\''}</span>
                  <span className="text-gray-300">;</span>
                  {'\n\n'}
                  <span className="text-purple-400">export const</span>
                  <span className="text-gray-300"> envSchema = z.</span>
                  <span className="text-blue-400">object</span>
                  <span className="text-gray-300">(</span>
                  {'{'}
                  {'\n  '}
                  <span className="text-green-400">DATABASE_URL</span>
                  <span className="text-gray-300">: z.</span>
                  <span className="text-blue-400">string</span>
                  <span className="text-gray-300">(),</span>
                  {'\n  '}
                  <span className="text-green-400">AUTH_SECRET</span>
                  <span className="text-gray-300">: z.</span>
                  <span className="text-blue-400">string</span>
                  <span className="text-gray-300">(),</span>
                  {'\n'}
                  {'}'}
                  <span className="text-gray-300">);</span>
                </code>
              </pre>
            </div>
          </div>
        </div>

        <div className="flex flex-col min-h-0">
          <h3 className="text-lg font-semibold mb-4 text-zinc-200">{t4('typedEnv')}</h3>
          <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 flex-1 flex flex-col min-h-0">
            <div className="bg-gray-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 min-w-0 border-b border-gray-700 shrink-0">
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-[10px] sm:text-xs text-gray-400 truncate" title="apps/api/src/main.ts">apps/api/src/main.ts</span>
              </div>
              <Badge size="sm">{t4('typedEnvBadge')}</Badge>
            </div>
            <div className="p-6 overflow-x-auto flex-1 min-h-0">
              <pre className="text-xs sm:text-sm font-mono leading-relaxed text-gray-300">
                <code>
                  <span className="text-gray-500">// ✨ {t4('typedVarLabel')}</span>{'\n'}
                  <span className="text-purple-400">const</span>{' '}
                  <span className="text-blue-400">dbUrl</span>{' '}
                  <span className="text-purple-400">=</span>{' '}
                  <span className="text-blue-400">process</span>
                  <span className="text-gray-300">.</span>
                  <span className="text-blue-400">env</span>
                  <span className="text-gray-300">.</span>
                  <span className="text-yellow-400 underline decoration-red-500 decoration-wavy decoration-2">PATABASE_URL</span>
                  <span className="text-gray-300">;</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-zinc-200">{t4('validationTitle')}</h3>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            <div className="bg-gray-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 min-w-0 border-b border-gray-700">
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-[10px] sm:text-xs text-gray-400 truncate">.env.local.development</span>
              </div>
              <Badge size="sm">{t4('envFile')}</Badge>
            </div>
            <div className="p-4">
              <pre className="text-[11px] sm:text-xs font-mono text-gray-300 leading-relaxed">
                <code>
                  <span className="text-green-400">PATABASE_URL</span>
                  <span className="text-gray-500">=</span>
                  <span className="text-yellow-400">postgresql://...</span>
                  {'\n'}
                  <span className="text-green-400">PORT</span>
                  <span className="text-gray-500">=</span>
                  <span className="text-yellow-400">3090</span>
                  {'\n'}
                  <span className="text-green-400 border-2 p-1 border-green-400" > {'// AUTH_SECRET is missing'}</span>

                </code>
              </pre>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            <div className="bg-gray-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 min-w-0 border-b border-gray-700">
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-[10px] sm:text-xs text-gray-400 truncate">{t4('terminal')}</span>
              </div>
              <Badge size="sm">{t4('result')}</Badge>
            </div>
            <div className="p-4">
              <pre className="text-[11px] sm:text-xs font-mono text-gray-300 leading-relaxed">
                <code>
                  <span className="text-red-400">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
                  {'\n'}
                  <span className="text-white">🔍 Validating environment variables</span>
                  {'\n'}
                  <span className="text-red-400">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
                  {'\n\n'}
                  <span className="text-red-400">  ❌ apps/api: Missing env variable : AUTH_SECRET</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
