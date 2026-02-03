'use client';

import { useTranslations } from 'next-intl';
import { trpc } from '@web/libs/trpc-client';
import { Badge } from '@repo/ui/badge/badge';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error != null && 'message' in error) return String((error as { message: unknown }).message);
  return String(error);
}

function isAuthError(error: unknown): boolean {
  const msg = getErrorMessage(error).toLowerCase();
  return msg.includes('unauthorized') || msg.includes('unauthenticated') || msg.includes('401');
}

export function ApiProtetionStep() {
  const t = useTranslations('Landing.step6');

  const publicQuery = trpc.app.hello.useQuery(undefined, { enabled: false });
  const protectedQuery = trpc.app.protectedHello.useQuery(undefined, { enabled: false });

  const publicErrorText = publicQuery.error != null
    ? (isAuthError(publicQuery.error) ? t('unauthorized') : getErrorMessage(publicQuery.error))
    : null;
  const protectedErrorText = protectedQuery.error != null
    ? (isAuthError(protectedQuery.error) ? t('unauthorized') : getErrorMessage(protectedQuery.error))
    : null;

  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2 min-w-0">
        {/* Code block : en 2e sur mobile pour laisser les cartes interactives en premier */}
        <div className="min-w-0 order-2 lg:order-1 bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
          <div className="bg-gray-800 px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2 min-w-0 border-b border-gray-700">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-hidden">
              <div className="flex gap-1 shrink-0">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-[9px] sm:text-xs text-gray-400 truncate min-w-0" title="apps/api/src/app.router.ts">apps/api/src/app.router.ts</span>
            </div>
            <Badge size="sm">{t('backendSide')}</Badge>
          </div>
          <div className="p-2 sm:p-4 overflow-x-auto overflow-y-auto max-h-[200px] sm:max-h-[280px] lg:max-h-none min-w-0">
            <pre className="text-[10px] sm:text-xs font-mono leading-snug text-gray-300 min-w-max">
              <code>


                <span className="text-green-400 border border-green-400 px-0.5 py-px rounded text-[9px] sm:text-[10px]" > {'// Protect the entire router'}</span>
                {'\n'}
                <span className="text-purple-400">@AuthGuardRouter</span>
                <span className="text-gray-300">({' {'} alias: </span>
                <span className="text-blue-400">'app'</span>
                <span className="text-gray-300"> {'}'})</span>

                {'\n'}
                <span className="text-gray-500">export class</span>{' '}
                <span className="text-gray-500">AppRouter</span>
                <span className="text-gray-500"> {'{'}</span>
                {'\n'}
                <span className="text-gray-500">  </span>
                <span className="text-gray-500">@Query</span>
                <span className="text-gray-500">(...)</span>
                {'\n'}
                <span className="text-gray-300">  </span>
                <span className="text-purple-400">@Public</span>
                <span className="text-gray-300">()</span>
                <span className="ml-2 sm:ml-4 text-green-400 border border-green-400 px-0.5 py-px rounded text-[9px] sm:text-[10px]" > {'// Public route'}</span>
                {'\n'}
                <span className="text-gray-300">  </span>
                <span className="text-purple-400">async</span>{' '}
                <span className="text-yellow-400">hello</span>
                <span className="text-gray-300">() {'{'} ... {'}'}</span>
                {'\n\n'}
                <span className="text-gray-300">  </span>
                <span className="text-purple-400">@Query</span>
                <span className="text-gray-300">(...)</span>
                <span className="ml-2 sm:ml-4 text-green-400 border border-green-400 px-0.5 py-px rounded text-[9px] sm:text-[10px]" > {'// Private route'}</span>
                {'\n'}
                <span className="text-gray-300">  </span>
                <span className="text-purple-400">async</span>{' '}
                <span className="text-yellow-400">protectedHello</span>
                <span className="text-gray-300">(</span>
                <span className="text-purple-400">@Session</span>
                <span className="text-gray-300">() session: </span>
                <span className="text-blue-400">UserSession</span>

                <span className="text-gray-300">) {'{'} ... {'}'}</span>

                {'\n'}
                <span className="text-gray-300">{'}'}</span>
              </code>
            </pre>
          </div>
        </div>

        {/* Cartes Public / Protected : en 1er sur mobile */}
        <div className="min-w-0 order-1 lg:order-2 space-y-4 sm:space-y-6">
          <div className="min-w-0 bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            <div className="bg-gray-800 px-3 sm:px-4 py-2 border-b border-gray-700 min-w-0">
              <span className="text-xs font-medium text-gray-300 truncate block">{t('publicFetch')}</span>
            </div>
            <div className="p-3 sm:p-6 bg-white min-w-0">
              <button
                type="button"
                onClick={() => publicQuery.refetch()}
                disabled={publicQuery.isFetching}
                className="w-full sm:w-auto mb-3 sm:mb-4 px-3 sm:px-4 py-2.5 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
              >
                {publicQuery.isFetching ? t('loading') : t('fetchPublic')}
              </button>
              <div className="min-h-[60px] sm:min-h-[80px] min-w-0 overflow-hidden">
                {publicQuery.data != null && (
                  <pre className="text-[11px] sm:text-xs font-mono bg-emerald-50 text-emerald-900 p-3 sm:p-4 rounded border border-emerald-200 overflow-x-auto overflow-y-auto max-h-[120px] sm:max-h-none min-w-0 break-all">
                    {JSON.stringify(publicQuery.data, null, 2)}
                  </pre>
                )}
                {publicErrorText != null && (
                  <pre className="text-[11px] sm:text-xs font-mono bg-red-50 text-red-900 p-3 sm:p-4 rounded border border-red-200 overflow-x-auto overflow-y-auto max-h-[120px] sm:max-h-none min-w-0 break-all">
                    {publicErrorText}
                  </pre>
                )}
                {!publicQuery.data && !publicQuery.error && !publicQuery.isFetching && (
                  <p className="text-gray-700 text-sm">{t('clickToFetch')}</p>
                )}
              </div>
            </div>
          </div>

          <div className="min-w-0 bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            <div className="bg-gray-800 px-3 sm:px-4 py-2 border-b border-gray-700 min-w-0">
              <span className="text-xs font-medium text-gray-300 truncate block">{t('protectedFetch')}</span>
            </div>
            <div className="p-3 sm:p-6 bg-white min-w-0">
              <button
                type="button"
                onClick={() => protectedQuery.refetch()}
                disabled={protectedQuery.isFetching}
                className="w-full sm:w-auto mb-3 sm:mb-4 px-3 sm:px-4 py-2.5 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
              >
                {protectedQuery.isFetching ? t('loading') : t('fetchProtected')}
              </button>
              <div className="min-h-[60px] sm:min-h-[80px] min-w-0 overflow-hidden">
                {protectedQuery.data != null && (
                  <pre className="text-[11px] sm:text-xs font-mono bg-emerald-50 text-emerald-900 p-3 sm:p-4 rounded border border-emerald-200 overflow-x-auto overflow-y-auto max-h-[120px] sm:max-h-none min-w-0 break-all">
                    {JSON.stringify(protectedQuery.data, null, 2)}
                  </pre>
                )}
                {protectedErrorText != null && (
                  <pre className="text-[11px] sm:text-xs font-mono bg-red-50 text-red-900 p-3 sm:p-4 rounded border border-red-200 overflow-x-auto overflow-y-auto max-h-[120px] sm:max-h-none min-w-0 break-all">
                    {protectedErrorText}
                  </pre>
                )}
                {!protectedQuery.data && !protectedQuery.error && !protectedQuery.isFetching && (
                  <p className="text-gray-700 text-sm">{t('clickToFetch')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
