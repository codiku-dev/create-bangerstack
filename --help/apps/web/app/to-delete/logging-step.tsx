'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@repo/ui/badge/badge';

export function LoggingStep() {
  const t = useTranslations('Landing.step9');

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <div className="bg-gray-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 min-w-0 border-b border-gray-700">
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400 truncate" title="apps/api/src/features/users/users.router.ts">apps/api/.../users.router.ts</span>
          </div>
          <Badge size="sm">{t('codeLabel')}</Badge>
        </div>
        <div className="p-6 overflow-x-auto">
          <pre className="text-xs sm:text-sm font-mono leading-relaxed text-gray-300">
            <code>
              <span className="text-purple-400">@AuthGuard</span>
              <span className="text-gray-300">({' {'} alias: </span>
              <span className="text-blue-400">'users, </span>
              <span className="border-2 border-green-400 p-1">
                <span className="text-gray-300"> logs: </span>
                <span className="text-amber-400">true</span>
              </span>
              <span className="text-gray-300"> {'}'})</span>
              {'\n'}
              <span className="text-gray-300">export class</span>
              <span className="text-gray-300"> UserRouter </span>
              <span className="text-gray-300">{'{'}</span>
              {'\n'}
              <span className="text-gray-300">  </span>
              <span className="text-gray-300">@Query</span>
              <span className="text-gray-300">(...)</span>
              {'\n'}
              <span className="text-gray-300">  </span>
              <span className="text-gray-300">async</span>
              <span className="text-gray-300"> read</span>
              <span className="text-gray-300">(...) {'{'} ... {'}'}</span>
              {'\n'}
              <span className="text-gray-300">{'}'}</span>
            </code>
          </pre>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <div className="bg-gray-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 min-w-0 border-b border-gray-700">
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400 truncate">api:dev</span>
          </div>
          <Badge size="sm">{t('terminalLabel')}</Badge>
        </div>
        <div className="p-4 overflow-x-auto">
          <pre className="text-[11px] sm:text-xs font-mono leading-relaxed text-gray-300 whitespace-pre">
            <code>
              <span className="text-gray-400">────────────────────────────────────────────────────────</span>
              {'\n  '}
              <span className="text-gray-200">URL</span>
              {'\n'}
              <span className="text-gray-400">────────────────────────────────────────────────</span>
              {'\n  '}
              <span className="text-cyan-300">http://localhost:3090/trpc/users.read</span>
              {'\n\n  '}
              <span className="text-gray-200">META</span>
              {'\n'}
              <span className="text-gray-400">────────────────────────────────────────────────</span>
              {'\n  '}
              <span className="text-gray-500">path       </span>
              <span className="text-gray-300">users.read</span>
              {'\n  '}
              <span className="text-gray-500">type       </span>
              <span className="text-gray-300">query</span>
              {'\n  '}
              <span className="text-gray-500">duration   </span>
              <span className="text-gray-300">40 ms</span>
              {'\n\n  '}
              <span className="text-red-400">RESPONSE (error)</span>
              {'\n'}
              <span className="text-gray-400">────────────────────────────────────────────────</span>
              {'\n  '}
              <span className="text-gray-300">{'{'}</span>
              {'\n    '}
              <span className="text-gray-500">"cause"</span>
              <span className="text-gray-300">: {'{'}</span>
              {'\n      '}
              <span className="text-gray-500">"message"</span>
              <span className="text-gray-300">: </span>
              <span className="text-yellow-300">"User with ID 1 not found"</span>
              <span className="text-gray-300">,</span>
              {'\n      '}
              <span className="text-gray-500">"name"</span>
              <span className="text-gray-300">: </span>
              <span className="text-yellow-300">"NotFoundException"</span>
              {'\n    '}
              <span className="text-gray-300">{'}'},</span>
              {'\n    '}
              <span className="text-gray-500">"code"</span>
              <span className="text-gray-300">: </span>
              <span className="text-yellow-300">"INTERNAL_SERVER_ERROR"</span>
              <span className="text-gray-300">,</span>
              {'\n    '}
              <span className="text-gray-500">"name"</span>
              <span className="text-gray-300">: </span>
              <span className="text-yellow-300">"TRPCError"</span>
              {'\n  '}
              <span className="text-gray-300">{'}'}</span>
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
