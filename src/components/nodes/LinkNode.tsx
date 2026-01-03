'use client'

import { useCallback, useState } from 'react'
import { useCanvasStore, CanvasNode } from '@/store/canvasStore'
import { Link2, ExternalLink, Globe } from 'lucide-react'

interface LinkNodeProps {
  node: CanvasNode
}

export function LinkNode({ node }: LinkNodeProps) {
  const { updateNode } = useCanvasStore()
  const [isEditing, setIsEditing] = useState(!node.content || node.content === 'https://')

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { content: e.target.value })
  }, [node.id, updateNode])

  const handleBlur = useCallback(() => {
    if (node.content && node.content !== 'https://') {
      setIsEditing(false)
    }
  }, [node.content])

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true)
  }, [])

  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '')
      return domain
    } catch {
      return url
    }
  }

  const isValidUrl = node.content && node.content.startsWith('http')

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/40">
          <Link2 className="w-3.5 h-3.5" />
          <span className="text-xs uppercase tracking-wider">Link</span>
        </div>
        <input
          type="url"
          value={node.content}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="https://example.com"
          autoFocus
          className="w-full bg-black/20 rounded-lg border border-white/5 px-3 py-2
            text-sm text-white/90 placeholder:text-white/20
            focus:outline-none focus:border-accent-sky/30"
        />
      </div>
    )
  }

  return (
    <div className="space-y-2" onDoubleClick={handleDoubleClick}>
      <div className="flex items-center gap-2 text-white/40">
        <Link2 className="w-3.5 h-3.5" />
        <span className="text-xs uppercase tracking-wider">Link</span>
      </div>
      
      <a
        href={node.content}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5
          hover:border-accent-sky/30 hover:bg-accent-sky/5 transition-all group"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-8 h-8 rounded-lg bg-accent-sky/20 flex items-center justify-center">
          <Globe className="w-4 h-4 text-accent-sky" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white/90 truncate">{extractDomain(node.content)}</p>
        </div>
        <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-accent-sky transition-colors" />
      </a>
    </div>
  )
}

