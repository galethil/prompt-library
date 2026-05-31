import { useState, useEffect } from 'react'
import type { Prompt } from '../types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'

interface PromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prompt?: Prompt
  onSave: (prompt: Partial<Prompt>) => void
}

export function PromptDialog({
  open,
  onOpenChange,
  prompt,
  onSave,
}: PromptDialogProps) {
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    if (prompt) {
      setName(prompt.name)
      setText(prompt.text)
    } else {
      setName('')
      setText('')
    }
  }, [prompt, open])

  const handleSave = () => {
    if (!name.trim()) return
    onSave({ name: name.trim(), text: text.trim() })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{prompt ? 'Edit Prompt' : 'New Prompt'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter prompt name"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Prompt Text</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter prompt text"
              rows={8}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
