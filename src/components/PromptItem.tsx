import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import type { Prompt } from '../types'
import { Button } from './ui/button'
import { Copy, Pencil, Trash2, FileText, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PromptItemProps {
  prompt: Prompt
  onCopy: () => void
  onEdit: () => void
  onDelete: () => void
  depth: number
}

export function PromptItem({ prompt, onCopy, onEdit, onDelete, depth }: PromptItemProps) {
  const [showCopied, setShowCopied] = useState(false)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: prompt.id,
  })

  function handleCopy() {
    onCopy()
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group border-b hover:bg-accent/50 transition-colors',
        isDragging && 'opacity-50'
      )}
    >
      <div
        className="flex items-center gap-2 p-3"
        style={{ paddingLeft: `${depth * 1.5}rem` }}
      >
        <div
          {...listeners}
          {...attributes}
          className="cursor-grab active:cursor-grabbing shrink-0"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground/30 group-hover:text-accent-foreground transition-colors" />
        </div>
        <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
        <span className="relative flex-1 min-w-0">
          <span className="block truncate cursor-pointer hover:text-primary" onClick={handleCopy} title="Copy to clipboard">
            {prompt.name}
          </span>
          {showCopied && (
            <span className="absolute -top-8 left-0 z-50 rounded bg-foreground px-2 py-1 text-xs text-background shadow pointer-events-none whitespace-nowrap">
              Prompt copied!
            </span>
          )}
        </span>
        <div className="flex gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onEdit}
            title="Edit prompt"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onDelete}
            title="Delete prompt"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
