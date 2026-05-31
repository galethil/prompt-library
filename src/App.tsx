import { useEffect, useRef, useState } from 'react'
import { PromptTree } from './components/PromptTree'
import { PromptDialog } from './components/PromptDialog'
import { FolderDialog } from './components/FolderDialog'
import { ImportExportPage } from './components/ImportExportPage'
import { InstallationPage } from './components/InstallationPage'
import { RecentPrompts } from './components/RecentPrompts'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Prompt, Folder, PromptLibrary } from './types'
import { Menu, X, BookOpen, ArrowLeftRight, Download, MonitorDown } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type Page = 'library' | 'import-export' | 'installation'

const initialData: PromptLibrary = {
  prompts: [],
  folders: [],
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function App() {
  const [library, setLibrary] = useLocalStorage<PromptLibrary>('prompt-library', initialData)
  const [recentPromptIds, setRecentPromptIds] = useLocalStorage<string[]>('recent-prompts', [])
  const [page, setPage] = useState<Page>('library')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
  const [promptDialog, setPromptDialog] = useState<{
    open: boolean
    prompt?: Prompt
    folderId: string | null
  }>({ open: false, folderId: null })
  const [folderDialog, setFolderDialog] = useState<{
    open: boolean
    folder?: Folder
    parentId: string | null
  }>({ open: false, parentId: null })

  const handleCopyPrompt = async (promptId: string) => {
    const prompt = library.prompts.find((p) => p.id === promptId)
    if (prompt) {
      try {
        await navigator.clipboard.writeText(prompt.text)
        setRecentPromptIds((prev) => {
          const filtered = prev.filter((id) => id !== promptId)
          return [promptId, ...filtered].slice(0, 5)
        })
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  // Ensure all prompts have valid UUIDs (migration for imported/legacy data)
  useEffect(() => {
    const needsMigration = library.prompts.some((p) => !UUID_REGEX.test(p.id))
    if (needsMigration) {
      setLibrary({
        ...library,
        prompts: library.prompts.map((p) => ({
          ...p,
          id: UUID_REGEX.test(p.id) ? p.id : crypto.randomUUID(),
        })),
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSavePrompt = (data: Partial<Prompt>) => {
    if (promptDialog.prompt) {
      setLibrary({
        ...library,
        prompts: library.prompts.map((p) =>
          p.id === promptDialog.prompt!.id ? { ...p, ...data } : p
        ),
      })
    } else {
      const newPrompt: Prompt = {
        id: crypto.randomUUID(),
        name: data.name!,
        text: data.text!,
        folderId: promptDialog.folderId,
      }
      setLibrary({
        ...library,
        prompts: [...library.prompts, newPrompt],
      })
    }
  }

  const handleDeletePrompt = (promptId: string) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      setLibrary({
        ...library,
        prompts: library.prompts.filter((p) => p.id !== promptId),
      })
    }
  }

  const handleSaveFolder = (name: string) => {
    if (folderDialog.folder) {
      setLibrary({
        ...library,
        folders: library.folders.map((f) =>
          f.id === folderDialog.folder!.id ? { ...f, name } : f
        ),
      })
    } else {
      const newFolder: Folder = {
        id: crypto.randomUUID(),
        name,
        parentId: folderDialog.parentId,
      }
      setLibrary({
        ...library,
        folders: [...library.folders, newFolder],
      })
    }
  }

  const handleDeleteFolder = (folderId: string) => {
    const hasChildren =
      library.folders.some((f) => f.parentId === folderId) ||
      library.prompts.some((p) => p.folderId === folderId)

    if (hasChildren) {
      alert('Cannot delete folder with contents. Please remove all items first.')
      return
    }

    if (confirm('Are you sure you want to delete this folder?')) {
      setLibrary({
        ...library,
        folders: library.folders.filter((f) => f.id !== folderId),
      })
    }
  }

  const handleMovePrompt = (promptId: string, newFolderId: string | null) => {
    setLibrary({
      ...library,
      prompts: library.prompts.map((p) =>
        p.id === promptId ? { ...p, folderId: newFolderId } : p
      ),
    })
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    const installedHandler = () => setIsInstalled(true)
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', installedHandler)
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstalled(true)
      setInstallPrompt(null)
    }
  }

  const navigate = (target: Page) => {
    setPage(target)
    setMenuOpen(false)
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Prompt Library</h1>
        <div className="flex items-center gap-2">
        {!isInstalled && installPrompt && (
          <button
            onClick={handleInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Download className="size-4" />
            Install App
          </button>
        )}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-50 py-1">
              <button
                onClick={() => navigate('library')}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${page === 'library' ? 'font-semibold' : ''}`}
              >
                <BookOpen className="size-4" />
                Library
              </button>
              <button
                onClick={() => navigate('import-export')}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${page === 'import-export' ? 'font-semibold' : ''}`}
              >
                <ArrowLeftRight className="size-4" />
                Import &amp; Export
              </button>
              <button
                onClick={() => navigate('installation')}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${page === 'installation' ? 'font-semibold' : ''}`}
              >
                <MonitorDown className="size-4" />
                Installation
              </button>
            </div>
          )}
        </div>
        </div>
      </header>
      {page === 'import-export' ? (
        <main className="flex-1 overflow-auto">
          <ImportExportPage library={library} onImport={setLibrary} />
        </main>
      ) : page === 'installation' ? (
        <main className="flex-1 overflow-auto">
          <InstallationPage />
        </main>
      ) : (
      <main className="flex-1 overflow-hidden flex flex-col">
        <RecentPrompts
          recentIds={recentPromptIds}
          prompts={library.prompts}
          onCopy={handleCopyPrompt}
        />
        <div className="flex-1 overflow-hidden">
          <PromptTree
            prompts={library.prompts}
            folders={library.folders}
            onCopyPrompt={handleCopyPrompt}
            onEditPrompt={(prompt) =>
              setPromptDialog({ open: true, prompt, folderId: prompt.folderId })
            }
            onDeletePrompt={handleDeletePrompt}
            onEditFolder={(folder) =>
              setFolderDialog({ open: true, folder, parentId: folder.parentId })
            }
            onDeleteFolder={handleDeleteFolder}
            onAddPrompt={(folderId) =>
              setPromptDialog({ open: true, folderId })
            }
            onAddFolder={(parentId) =>
              setFolderDialog({ open: true, parentId })
            }
            onMovePrompt={handleMovePrompt}
          />
        </div>
      </main>
      )}
      <PromptDialog
        open={promptDialog.open}
        onOpenChange={(open) => setPromptDialog({ ...promptDialog, open })}
        prompt={promptDialog.prompt}
        onSave={handleSavePrompt}
      />
      <FolderDialog
        open={folderDialog.open}
        onOpenChange={(open) => setFolderDialog({ ...folderDialog, open })}
        folder={folderDialog.folder}
        onSave={handleSaveFolder}
      />
    </div>
  )
}

export default App
