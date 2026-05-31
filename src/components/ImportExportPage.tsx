import { useRef, useState } from 'react'
import { Button } from './ui/button'
import { Download, Upload, CheckCircle, AlertCircle } from 'lucide-react'
import type { PromptLibrary } from '../types'

interface ImportExportPageProps {
  library: PromptLibrary
  onImport: (library: PromptLibrary) => void
}

export function ImportExportPage({ library, onImport }: ImportExportPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [importError, setImportError] = useState<string>('')

  const handleExport = () => {
    const json = JSON.stringify(library, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-library-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    setImportStatus('idle')
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string)
        if (
          !parsed ||
          !Array.isArray(parsed.prompts) ||
          !Array.isArray(parsed.folders)
        ) {
          throw new Error('Invalid format: file must contain "prompts" and "folders" arrays.')
        }
        if (!confirm('This will replace all current content. Are you sure?')) {
          e.target.value = ''
          return
        }
        onImport(parsed as PromptLibrary)
        setImportStatus('success')
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Failed to parse JSON file.')
        setImportStatus('error')
      }
      e.target.value = ''
    }
    reader.readAsText(file)
  }

  const promptCount = library.prompts.length
  const folderCount = library.folders.length

  return (
    <div className="max-w-lg mx-auto p-8 flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-1">Import &amp; Export</h2>
        <p className="text-sm text-gray-500">
          Back up your prompt library or restore it from a previous export.
        </p>
      </div>

      {/* Export */}
      <div className="border rounded-lg p-5 flex flex-col gap-3">
        <div>
          <h3 className="font-medium">Export to JSON</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Download your current library as a JSON file.
            Currently contains <strong>{promptCount}</strong> prompt{promptCount !== 1 ? 's' : ''} across <strong>{folderCount}</strong> folder{folderCount !== 1 ? 's' : ''}.
          </p>
        </div>
        <Button onClick={handleExport} className="w-fit gap-2">
          <Download className="size-4" />
          Export
        </Button>
      </div>

      {/* Import */}
      <div className="border rounded-lg p-5 flex flex-col gap-3">
        <div>
          <h3 className="font-medium">Import from JSON</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Replace the entire library with the contents of a previously exported JSON file.
            <span className="text-amber-600 font-medium"> This cannot be undone.</span>
          </p>
        </div>
        <Button variant="outline" onClick={handleImportClick} className="w-fit gap-2">
          <Upload className="size-4" />
          Import
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleFileChange}
        />
        {importStatus === 'success' && (
          <p className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle className="size-4" />
            Library imported successfully.
          </p>
        )}
        {importStatus === 'error' && (
          <p className="flex items-center gap-1.5 text-sm text-red-600">
            <AlertCircle className="size-4" />
            {importError}
          </p>
        )}
      </div>
    </div>
  )
}
