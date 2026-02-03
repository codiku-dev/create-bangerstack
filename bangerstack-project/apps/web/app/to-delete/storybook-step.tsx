'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Badge } from '@repo/ui/badge/badge';

export function StorybookStep() {
  const t = useTranslations('Landing.step3');

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <div className="bg-gray-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 min-w-0 border-b border-gray-700">
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400 truncate" title="packages/ui/src/button/button.stories.tsx">packages/ui/src/button/button.stories.tsx</span>
          </div>
          <Badge size="sm">{t('uiPackageSide')}</Badge>
        </div>
        <div className="p-6 overflow-x-auto">
          <pre className="text-xs sm:text-sm font-mono leading-relaxed text-gray-300">
            <code>
              <span className="text-gray-500">import type</span>{' '}
              <span className="text-blue-400">{'{'} Meta, StoryObj {'}'}</span>{' '}
              <span className="text-gray-500">from</span>{' '}
              <span className="text-green-400">'@storybook/react'</span>
              <span className="text-gray-300">;</span>{'\n'}
              <span className="text-gray-500">import</span>{' '}
              <span className="text-blue-400">{'{'} Button {'}'}</span>{' '}
              <span className="text-gray-500">from</span>{' '}
              <span className="text-green-400">'./button'</span>
              <span className="text-gray-300">;</span>{'\n\n'}
              <span className="text-purple-400">const</span>{' '}
              <span className="text-blue-400">meta</span>
              <span className="text-gray-300">: </span>
              <span className="text-blue-400">Meta</span>
              <span className="text-gray-300">&lt;</span>
              <span className="text-blue-400">typeof</span>{' '}
              <span className="text-yellow-400">Button</span>
              <span className="text-gray-300">&gt; = </span>
              <span className="text-gray-300">{'{'}</span>
              <span className="text-gray-300">{'\n'}</span>
              <span className="text-gray-300">  </span>
              <span className="text-blue-400">title</span>
              <span className="text-gray-300">: </span>
              <span className="text-green-400">'UI/Button'</span>
              <span className="text-gray-300">,</span>{'\n'}
              <span className="text-gray-300">  </span>
              <span className="text-blue-400">component</span>
              <span className="text-gray-300">: </span>
              <span className="text-yellow-400">Button</span>
              <span className="text-gray-300">,</span>{'\n'}
              <span className="text-gray-300">{'}'}</span>
              <span className="text-gray-300">;</span>{'\n\n'}
              <span className="text-purple-400">export default</span>{' '}
              <span className="text-blue-400">meta</span>
              <span className="text-gray-300">;</span>
            </code>
          </pre>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-800 shadow-lg bg-gray-900">
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
          <span className="text-xs text-gray-400">Storybook</span>
        </div>
        <div className="p-0">
          <Image
            src="/sb.png"
            alt="Storybook screenshot"
            width={1200}
            height={800}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
}
