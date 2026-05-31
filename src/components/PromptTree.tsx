import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { Folder as FolderType, Prompt } from '../types'
import { FolderItem } from './FolderItem'
import { PromptItem } from './PromptItem'
import { Button } from './ui/button'
import { FolderPlus, FilePlus } from 'lucide-react'

interface PromptTreeProps {
  prompts: Prompt[]
  folders: FolderType[]
  onCopyPrompt: (promptId: string) => void
  onEditPrompt: (prompt: Prompt) => void
  onDeletePrompt: (promptId: string) => void
  onEditFolder: (folder: FolderType) => void
  onDeleteFolder: (folderId: string) => void
  onAddPrompt: (folderId: string | null) => void
  onAddFolder: (parentId: string | null) => void
  onMovePrompt: (promptId: string, newFolderId: string | null) => void
}

export function PromptTree({
  prompts,
  folders,
  onCopyPrompt,
  onEditPrompt,
  onDeletePrompt,
  onEditFolder,
  onDeleteFolder,
  onAddPrompt,
  onAddFolder,
  onMovePrompt,
}: PromptTreeProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    const activePrompt = prompts.find((p) => p.id === active.id)
    if (!activePrompt) return

    if (over.id === 'root') {
      onMovePrompt(activePrompt.id, null)
    } else {
      const overFolder = folders.find((f) => f.id === over.id)
      if (overFolder) {
        onMovePrompt(activePrompt.id, overFolder.id)
      }
    }
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

  const getChildFolders = (parentId: string | null) => {
    return folders.filter((f) => f.parentId === parentId)
  }

  const getPromptsInFolder = (folderId: string | null) => {
    return prompts.filter((p) => p.folderId === folderId)
  }

  const renderFolder = (folder: FolderType, depth: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id)
    const childFolders = getChildFolders(folder.id)
    const folderPrompts = getPromptsInFolder(folder.id)

    return (
      <div key={folder.id}>
        <FolderItem
          folder={folder}
          isExpanded={isExpanded}
          onToggle={() => toggleFolder(folder.id)}
          onEdit={() => onEditFolder(folder)}
          onDelete={() => onDeleteFolder(folder.id)}
          onAddPrompt={() => onAddPrompt(folder.id)}
          onAddFolder={() => onAddFolder(folder.id)}
          depth={depth}
        />
        {isExpanded && (
          <div>
            {childFolders.map((child) => renderFolder(child, depth + 1))}
            {folderPrompts.map((prompt) => (
              <PromptItem
                key={prompt.id}
                prompt={prompt}
                onCopy={() => onCopyPrompt(prompt.id)}
                onEdit={() => onEditPrompt(prompt)}
                onDelete={() => onDeletePrompt(prompt.id)}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  const rootFolders = getChildFolders(null)
  const rootPrompts = getPromptsInFolder(null)
  const activePrompt = prompts.find((p) => p.id === activeId)

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full">
        <div className="flex gap-2 p-4 border-b">
          <Button onClick={() => onAddPrompt(null)} size="sm">
            <FilePlus className="mr-2 h-4 w-4" />
            Add Prompt
          </Button>
          <Button onClick={() => onAddFolder(null)} size="sm" variant="outline">
            <FolderPlus className="mr-2 h-4 w-4" />
            Add Folder
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          {rootFolders.map((folder) => renderFolder(folder))}
          {rootPrompts.map((prompt) => (
            <PromptItem
              key={prompt.id}
              prompt={prompt}
              onCopy={() => onCopyPrompt(prompt.id)}
              onEdit={() => onEditPrompt(prompt)}
              onDelete={() => onDeletePrompt(prompt.id)}
              depth={0}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activePrompt && (
          <div className="bg-card border rounded p-2 shadow-lg opacity-90">
            {activePrompt.name}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
