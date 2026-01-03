'use client'

import { useCallback, useRef, useEffect } from 'react'
import { useCanvasStore, CanvasNode } from '@/store/canvasStore'

interface NoteNodeProps {
  node: CanvasNode
}

export function NoteNode({ node }: NoteNodeProps) {
  const { updateNode } = useCanvasStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (node.isEditing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [node.isEditing])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNode(node.id, { content: e.target.value })
  }, [node.id, updateNode])

  const handleBlur = useCallback(() => {
    updateNode(node.id, { isEditing: false })
  }, [node.id, updateNode])

  const handleDoubleClick = useCallback(() => {
    updateNode(node.id, { isEditing: true })
  }, [node.id, updateNode])

  return (
    <div className="h-full" onDoubleClick={handleDoubleClick}>
      <textarea
        ref={textareaRef}
        value={node.content}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Write something brilliant..."
        className="w-full h-full min-h-[100px] bg-transparent border-none outline-none resize-none
          font-body text-white/90 text-sm leading-relaxed placeholder:text-white/30
          focus:ring-0"
        style={{ caretColor: '#a78bfa' }}
      />
    </div>
  )
}

