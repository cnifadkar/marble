'use client'

import { useCallback, useState } from 'react'
import { useCanvasStore, CanvasNode } from '@/store/canvasStore'
import { Image as ImageIcon, Upload, Link } from 'lucide-react'

interface ImageNodeProps {
  node: CanvasNode
}

export function ImageNode({ node }: ImageNodeProps) {
  const { updateNode } = useCanvasStore()
  const [inputMode, setInputMode] = useState<'url' | null>(null)
  const [urlInput, setUrlInput] = useState('')

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      updateNode(node.id, { content: urlInput.trim() })
      setInputMode(null)
      setUrlInput('')
    }
  }, [urlInput, node.id, updateNode])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUrlSubmit()
    }
    if (e.key === 'Escape') {
      setInputMode(null)
      setUrlInput('')
    }
  }, [handleUrlSubmit])

  if (node.content) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/40">
          <ImageIcon className="w-3.5 h-3.5" />
          <span className="text-xs uppercase tracking-wider">Image</span>
        </div>
        <div className="relative rounded-lg overflow-hidden bg-black/20">
          <img
            src={node.content}
            alt="Canvas image"
            className="w-full h-auto max-h-[300px] object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      </div>
    )
  }

  if (inputMode === 'url') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-white/40">
          <ImageIcon className="w-3.5 h-3.5" />
          <span className="text-xs uppercase tracking-wider">Image URL</span>
        </div>
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com/image.jpg"
          autoFocus
          className="w-full bg-black/20 rounded-lg border border-white/5 px-3 py-2
            text-sm text-white/90 placeholder:text-white/20
            focus:outline-none focus:border-accent-rose/30"
        />
        <div className="flex gap-2">
          <button
            onClick={handleUrlSubmit}
            className="flex-1 py-2 rounded-lg bg-accent-rose/20 text-accent-rose text-sm font-medium
              hover:bg-accent-rose/30 transition-colors"
          >
            Add Image
          </button>
          <button
            onClick={() => setInputMode(null)}
            className="px-3 py-2 rounded-lg bg-white/5 text-white/60 text-sm
              hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-white/40">
        <ImageIcon className="w-3.5 h-3.5" />
        <span className="text-xs uppercase tracking-wider">Image</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setInputMode('url')}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg
            bg-black/20 border border-white/5 hover:border-accent-rose/30 
            hover:bg-accent-rose/5 transition-all group"
        >
          <Link className="w-5 h-5 text-white/40 group-hover:text-accent-rose transition-colors" />
          <span className="text-xs text-white/40 group-hover:text-white/60">From URL</span>
        </button>
        <button
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg
            bg-black/20 border border-white/5 hover:border-accent-rose/30 
            hover:bg-accent-rose/5 transition-all group cursor-not-allowed opacity-50"
          disabled
        >
          <Upload className="w-5 h-5 text-white/40" />
          <span className="text-xs text-white/40">Upload</span>
        </button>
      </div>
    </div>
  )
}

