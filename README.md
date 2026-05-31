# Prompt Library PWA

A mobile-friendly Progressive Web App for managing prompts in a hierarchical folder structure. Built with React, Vite, Tailwind CSS v4, and shadcn-inspired UI components.

## Features

- ✅ **Offline-First PWA** - Works completely offline with service worker caching
- ✅ **Hierarchical Organization** - Create nested folders to organize prompts
- ✅ **Drag-and-Drop** - Move prompts between folders with intuitive drag-and-drop
- ✅ **Local Storage** - All data persists in browser local storage
- ✅ **Mobile-Friendly** - Responsive design optimized for mobile devices
- ✅ **Copy to Clipboard** - One-click copy of prompt text
- ✅ **CRUD Operations** - Create, edit, and delete prompts and folders

## Tech Stack

- **React 19** - UI framework
- **TypeScript 6** - Type safety
- **Vite 8** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS with new @theme syntax
- **@dnd-kit** - Drag-and-drop functionality
- **vite-plugin-pwa** - PWA capabilities with Workbox
- **shadcn-inspired components** - Custom UI components based on shadcn/ui patterns

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

### Managing Folders

1. Click "Add Folder" to create a root-level folder
2. Click the folder icon (➕) next to a folder to create a subfolder
3. Click the pencil icon to edit a folder name
4. Click the trash icon to delete a folder (only empty folders can be deleted)
5. Click the chevron to expand/collapse folders

### Managing Prompts

1. Click "Add Prompt" to create a prompt in the root
2. Click the file icon (➕) inside a folder to create a prompt in that folder
3. Fill in the prompt name and text in the dialog
4. Click the copy icon to copy the prompt text to clipboard
5. Click the pencil icon to edit a prompt
6. Click the trash icon to delete a prompt

### Drag-and-Drop

1. Hover over a prompt item to see the grip handle (⋮⋮)
2. Click and drag the prompt to move it
3. Drop it on a folder to move it there, or on the empty space for root level

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Input, Dialog, etc.)
│   ├── FolderDialog.tsx # Folder create/edit dialog
│   ├── FolderItem.tsx   # Folder list item with actions
│   ├── PromptDialog.tsx # Prompt create/edit dialog
│   ├── PromptItem.tsx   # Prompt list item with drag handle
│   └── PromptTree.tsx   # Main tree view with drag-and-drop
├── hooks/
│   └── useLocalStorage.ts # Custom hook for localStorage persistence
├── lib/
│   └── utils.ts         # Utility functions (cn for class merging)
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main application component
└── index.css            # Tailwind CSS v4 configuration
```

## PWA Features

- **Installable** - Can be installed on mobile devices and desktop
- **Offline Support** - Full functionality works without internet
- **Service Worker** - Caches all assets for offline use
- **App Manifest** - Provides native-like app experience

## Browser Support

- Modern browsers with ES2023 support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT
