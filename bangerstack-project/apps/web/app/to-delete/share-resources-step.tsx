'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@repo/ui/badge/badge';
import { Button } from '@repo/ui/button/button';

export function ShareResourcesStep() {
  const t = useTranslations('Landing.step2');

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
          <div className="bg-gray-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 min-w-0 border-b border-gray-700">
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-[10px] sm:text-xs text-gray-400 truncate" title="packages/ui/src/button/button.tsx">packages/ui/src/button/button.tsx</span>
            </div>
            <Badge size="sm">{t('uiPackageSide')}</Badge>
          </div>
          <div className="p-6 overflow-x-auto">
            <pre className="text-xs sm:text-sm font-mono leading-relaxed text-gray-300">
              <code>
                <span className="text-purple-400">export function</span>{' '}
                <span className="text-yellow-400">Button</span>
                <span className="text-gray-300">() {'{'}</span>{'\n'}
                <span className="text-purple-400">  return</span>{' '}
                <span className="text-gray-300">(</span>{'\n'}
                <span className="text-gray-300">    {'<'}</span>
                <span className="text-pink-400">button</span>{' '}
                <span className="text-blue-400">className</span>
                <span className="text-gray-300">=</span>
                <span className="text-green-400">"bg-red-500"</span>
                <span className="text-gray-300">{'>'}</span>{'\n'}
                <span className="text-gray-300">      Button</span>{'\n'}
                <span className="text-gray-300">    {'</'}</span>
                <span className="text-pink-400">button</span>
                <span className="text-gray-300">{'>'}</span>{'\n'}
                <span className="text-gray-300">  );</span>{'\n'}
                <span className="text-gray-300">{'}'}</span>
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
              <span className="text-[10px] sm:text-xs text-gray-400 truncate" title="apps/web/app/page.tsx">apps/web/app/page.tsx</span>
            </div>
            <Badge size="sm">{t('nextjsSide')}</Badge>
          </div>
          <div className="p-4">
            <pre className="text-[11px] sm:text-xs font-mono leading-relaxed text-gray-300">
              <code>
                <span className="text-gray-500">import</span>{' '}
                <span className="text-blue-400">{'{'} Button {'}'}</span>{' '}
                <span className="text-gray-500">from</span>{' '}
                <span className="text-green-400">'@repo/ui/button/button'</span>
                <span className="text-gray-300">;</span>{'\n\n'}
                <span className="text-purple-400">export default function</span>{' '}
                <span className="text-yellow-400">Page</span>
                <span className="text-gray-300">() {'{'}</span>{'\n'}
                <span className="text-purple-400">  return</span>{' '}
                <span className="text-gray-300">(</span>{'\n'}
                <span className="text-gray-300">    {'<'}</span>
                <span className="text-pink-400">Button</span>
                <span className="text-gray-300">{'>'}Mon bouton</span>
                <span className="text-gray-300">{'</'}</span>
                <span className="text-pink-400">Button</span>
                <span className="text-gray-300">{'>'}</span>{'\n'}
                <span className="text-gray-300">  );</span>{'\n'}
                <span className="text-gray-300">{'}'}</span>
              </code>
            </pre>
          </div>
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
            <span className="text-[10px] sm:text-xs text-gray-400 truncate">apps/web → import from @repo/ui</span>
          </div>
          <Badge size="sm">{t('result')}</Badge>
        </div>
        <div className="p-6 bg-gray-900">
          <p className="text-xs text-gray-400 mb-4">{t('resultLabel')}</p>
          <Button>{t('buttonLabel')}</Button>
        </div>
      </div>
    </div>
  );
}
