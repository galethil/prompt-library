import { useDroppable } from '@dnd-kit/core'
import type { Folder as FolderType } from '../types'
import { Button } from './ui/button'
import { ChevronRight, ChevronDown, Folder, FolderPlus, FilePlus, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FolderItemProps {
  folder: FolderType
  isExpanded: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  onAddPrompt: () => void
  onAddFolder: () => void
  depth: number
}

export function FolderItem({
  folder,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddPrompt,
  onAddFolder,
  depth,
}: FolderItemProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: folder.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'border-b hover:bg-accent/50 transition-colors',
        isOver && 'bg-accent'
      )}
      style={{ paddingLeft: `${depth * 1.5}rem` }}
    >
      <div className="flex items-center gap-2 p-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={onToggle}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        <Folder className="h-5 w-5 text-muted-foreground shrink-0" />
        <span className="flex-1 font-medium truncate cursor-pointer" onClick={onToggle}>{folder.name}</span>
        <div className="flex gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onAddPrompt}
            title="Add prompt"
          >
            <FilePlus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onAddFolder}
            title="Add subfolder"
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onEdit}
            title="Edit folder"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onDelete}
            title="Delete folder"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
