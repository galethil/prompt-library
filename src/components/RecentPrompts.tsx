import { useState } from 'react'
import type { Prompt } from '../types'
import { Copy, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecentPromptsProps {
  recentIds: string[]
  prompts: Prompt[]
  onCopy: (promptId: string) => void
}

export function RecentPrompts({ recentIds, prompts, onCopy }: RecentPromptsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const recentPrompts = recentIds
    .map((id) => prompts.find((p) => p.id === id))
    .filter((p): p is Prompt => p !== undefined)

  if (recentPrompts.length === 0) return null

  function handleCopy(promptId: string) {
    onCopy(promptId)
    setCopiedId(promptId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="border-b px-4 py-2.5 bg-muted/20 shrink-0">
      <div className="flex items-center gap-1.5 mb-2">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Quick Access
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {recentPrompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => handleCopy(prompt.id)}
            title={`Copy: ${prompt.name}`}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-all duration-150 max-w-[200px]',
              copiedId === prompt.id
                ? 'bg-green-50 border-green-300 text-green-700'
                : 'bg-white border-border text-gray-900 hover:bg-gray-50 hover:border-gray-300'
            )}
          >
            <Copy className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {copiedId === prompt.id ? 'Copied!' : prompt.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
