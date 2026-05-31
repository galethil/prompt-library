export function InstallationPage() {
  return (
    <div className="max-w-2xl mx-auto p-8 flex flex-col gap-10">
      <div>
        <h2 className="text-xl font-semibold mb-1">Installation Guide</h2>
        <p className="text-sm text-gray-500">
          Follow these steps to install Prompt Library as a native-like app on your Mac and launch it with a keyboard shortcut.
        </p>
      </div>

      {/* Step 1 */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center size-7 rounded-full bg-indigo-600 text-white text-sm font-bold shrink-0">1</span>
          <h3 className="font-semibold text-base">Install the PWA from your browser</h3>
        </div>
        <ol className="ml-10 flex flex-col gap-2 text-sm text-gray-700 list-decimal list-outside">
          <li>Open the app URL in <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>.</li>
          <li>
            Look for the <strong>Install</strong> icon in the address bar (a screen with a download arrow), or click the <strong>⋮ / …</strong> browser menu and choose <strong>"Install Prompt Library…"</strong>.
          </li>
          <li>Click <strong>Install</strong> in the confirmation dialog. The app will open in its own window.</li>
        </ol>
        <p className="ml-10 text-sm text-gray-500 italic">
          Alternatively, use the <strong>"Install App"</strong> button in the header of this page if it is visible.
        </p>
      </section>

      {/* Step 2 */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center size-7 rounded-full bg-indigo-600 text-white text-sm font-bold shrink-0">2</span>
          <h3 className="font-semibold text-base">Move the app to your Applications folder</h3>
        </div>
        <ol className="ml-10 flex flex-col gap-2 text-sm text-gray-700 list-decimal list-outside">
          <li>Open <strong>Finder</strong> and navigate to your user folder (<kbd className="px-1 py-0.5 bg-gray-100 border rounded text-xs">⌘ + Shift + H</kbd>).</li>
          <li>Go to <strong>Applications</strong> inside your home folder (not the top-level <em>/Applications</em>). You should see <strong>Prompt Library.app</strong> there after installation.</li>
          <li>Drag <strong>Prompt Library.app</strong> to the main <strong>/Applications</strong> folder in the sidebar to make it available system-wide.</li>
        </ol>
      </section>

      {/* Step 3 */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center size-7 rounded-full bg-indigo-600 text-white text-sm font-bold shrink-0">3</span>
          <h3 className="font-semibold text-base">Create a Quick Action in Automator</h3>
        </div>
        <ol className="ml-10 flex flex-col gap-2 text-sm text-gray-700 list-decimal list-outside">
          <li>Open <strong>Automator</strong> (find it via Spotlight: <kbd className="px-1 py-0.5 bg-gray-100 border rounded text-xs">⌘ Space</kbd>, then type <em>Automator</em>).</li>
          <li>Click <strong>New Document</strong>.</li>
          <li>Choose <strong>Quick Action</strong> as the document type and click <strong>Choose</strong>.</li>
          <li>
            In the search field on the left, search for <strong>"Launch Application"</strong>. Double-click it to add it to the workflow.
          </li>
          <li>In the action that appears, open the dropdown and select <strong>Prompt Library</strong> from the list of applications.</li>
          <li>
            Save the workflow: press <kbd className="px-1 py-0.5 bg-gray-100 border rounded text-xs">⌘ S</kbd>, give it a memorable name (e.g. <strong>"Open Prompt Library"</strong>), and click <strong>Save</strong>.
          </li>
        </ol>
      </section>

      {/* Step 4 */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center size-7 rounded-full bg-indigo-600 text-white text-sm font-bold shrink-0">4</span>
          <h3 className="font-semibold text-base">Assign a keyboard shortcut to the Quick Action</h3>
        </div>
        <ol className="ml-10 flex flex-col gap-2 text-sm text-gray-700 list-decimal list-outside">
          <li>
            Open <strong>System Settings</strong> (<kbd className="px-1 py-0.5 bg-gray-100 border rounded text-xs">⌘ Space</kbd> → <em>System Settings</em>).
          </li>
          <li>
            Go to <strong>Keyboard</strong> → <strong>Keyboard Shortcuts…</strong>.
          </li>
          <li>
            In the left panel select <strong>Services</strong>, then scroll to the <strong>General</strong> section on the right.
          </li>
          <li>
            Find <strong>"Open Prompt Library"</strong> (the name you saved in step 3). Click it to select it, then click <strong>Add Shortcut</strong> and press your desired key combination (e.g. <kbd className="px-1 py-0.5 bg-gray-100 border rounded text-xs">⌥ ⌘ P</kbd>).
          </li>
          <li>Close System Settings. Your shortcut is now active — press it from anywhere to launch Prompt Library instantly.</li>
        </ol>
      </section>
    </div>
  )
}
