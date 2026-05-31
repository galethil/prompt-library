export interface Prompt {
  id: string
  name: string
  text: string
  folderId: string | null
}

export interface Folder {
  id: string
  name: string
  parentId: string | null
}

export interface PromptLibrary {
  prompts: Prompt[]
  folders: Folder[]
}
