'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCanvasStore } from '@/store/canvasStore'
import { 
  Plus, 
  MoreHorizontal, 
  Trash2, 
  Copy, 
  Pencil,
  FileDown,
  FileUp,
  Clock,
  Layers,
  Search,
  Grid3X3,
  List,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const { canvases, createCanvas, deleteCanvas, duplicateCanvas, renameCanvas, switchCanvas, importCanvas } = useCanvasStore()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCreateCanvas = () => {
    const id = createCanvas('Untitled Canvas')
    router.push('/canvas')
  }

  const handleOpenCanvas = (id: string) => {
    switchCanvas(id)
    router.push('/canvas')
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this canvas?')) {
      deleteCanvas(id)
    }
    setMenuOpen(null)
  }

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    duplicateCanvas(id)
    setMenuOpen(null)
  }

  const handleRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const canvas = canvases.find(c => c.id === id)
    if (canvas) {
      setRenaming(id)
      setRenameValue(canvas.name)
    }
    setMenuOpen(null)
  }

  const handleRenameSubmit = (id: string) => {
    if (renameValue.trim()) {
      renameCanvas(id, renameValue.trim())
    }
    setRenaming(null)
    setRenameValue('')
  }

  const handleExport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    switchCanvas(id)
    const data = useCanvasStore.getState().exportCanvas()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `marble-canvas-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMenuOpen(null)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          importCanvas(content)
          router.push('/canvas')
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const filteredCanvases = canvases.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-marble-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-lavender/30 border-t-accent-lavender rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-marble-950 text-white">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-lavender to-accent-mint flex items-center justify-center">
                  <span className="font-display font-bold text-white text-sm">M</span>
                </div>
                <span className="font-display font-bold text-lg">Marble</span>
              </Link>
              <span className="text-white/30">|</span>
              <span className="text-white/60">Dashboard</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
              >
                <FileUp className="w-4 h-4" />
                Import
              </button>
              <button
                onClick={handleCreateCanvas}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-accent-lavender to-accent-mint hover:opacity-90 transition-opacity text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                New Canvas
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search canvases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-lavender/50"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Empty state */}
        {filteredCanvases.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-6">
              <Layers className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">
              {searchQuery ? 'No canvases found' : 'No canvases yet'}
            </h3>
            <p className="text-white/50 mb-6">
              {searchQuery ? 'Try a different search term' : 'Create your first canvas to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateCanvas}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-lavender to-accent-mint hover:opacity-90 transition-opacity font-medium"
              >
                <Plus className="w-5 h-5" />
                Create Canvas
              </button>
            )}
          </motion.div>
        )}

        {/* Grid view */}
        {viewMode === 'grid' && filteredCanvases.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredCanvases.map((canvas, i) => (
                <motion.div
                  key={canvas.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleOpenCanvas(canvas.id)}
                  className="group relative rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer overflow-hidden"
                >
                  {/* Preview area */}
                  <div className="aspect-video bg-marble-900 canvas-grid relative">
                    {canvas.nodes.slice(0, 3).map((node, i) => (
                      <div
                        key={node.id}
                        className="absolute w-12 h-8 rounded bg-accent-lavender/20 border border-accent-lavender/30"
                        style={{
                          left: `${20 + i * 25}%`,
                          top: `${20 + i * 15}%`,
                          transform: `rotate(${i * 5 - 5}deg)`,
                        }}
                      />
                    ))}
                    {canvas.nodes.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white/20 text-sm">Empty canvas</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="p-4">
                    {renaming === canvas.id ? (
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => handleRenameSubmit(canvas.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameSubmit(canvas.id)
                          if (e.key === 'Escape') setRenaming(null)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        className="w-full bg-transparent border-b border-accent-lavender outline-none font-medium"
                      />
                    ) : (
                      <h3 className="font-medium truncate">{canvas.name}</h3>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {canvas.nodes.length} nodes
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(canvas.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setMenuOpen(menuOpen === canvas.id ? null : canvas.id)
                      }}
                      className="p-2 rounded-lg bg-marble-900/80 opacity-0 group-hover:opacity-100 hover:bg-marble-800 transition-all"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    <AnimatePresence>
                      {menuOpen === canvas.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute top-full right-0 mt-1 w-40 py-1 rounded-lg bg-marble-800 border border-white/10 shadow-xl z-10"
                        >
                          <button
                            onClick={(e) => handleRename(canvas.id, e)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                            Rename
                          </button>
                          <button
                            onClick={(e) => handleDuplicate(canvas.id, e)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          <button
                            onClick={(e) => handleExport(canvas.id, e)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors"
                          >
                            <FileDown className="w-4 h-4" />
                            Export
                          </button>
                          <hr className="my-1 border-white/5" />
                          <button
                            onClick={(e) => handleDelete(canvas.id, e)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-accent-coral hover:bg-accent-coral/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* New canvas card */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: filteredCanvases.length * 0.05 }}
              onClick={handleCreateCanvas}
              className="group rounded-xl border border-dashed border-white/10 hover:border-accent-lavender/50 hover:bg-accent-lavender/5 transition-all cursor-pointer aspect-[4/3] flex flex-col items-center justify-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-accent-lavender/10 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6 text-white/40 group-hover:text-accent-lavender transition-colors" />
              </div>
              <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors">New Canvas</span>
            </motion.button>
          </div>
        )}

        {/* List view */}
        {viewMode === 'list' && filteredCanvases.length > 0 && (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredCanvases.map((canvas, i) => (
                <motion.div
                  key={canvas.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => handleOpenCanvas(canvas.id)}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer"
                >
                  {/* Preview */}
                  <div className="w-20 h-14 rounded-lg bg-marble-900 canvas-grid flex-shrink-0 relative overflow-hidden">
                    {canvas.nodes.slice(0, 2).map((node, i) => (
                      <div
                        key={node.id}
                        className="absolute w-6 h-4 rounded bg-accent-lavender/30"
                        style={{
                          left: `${15 + i * 30}%`,
                          top: `${20 + i * 20}%`,
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {renaming === canvas.id ? (
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => handleRenameSubmit(canvas.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameSubmit(canvas.id)
                          if (e.key === 'Escape') setRenaming(null)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        className="bg-transparent border-b border-accent-lavender outline-none font-medium"
                      />
                    ) : (
                      <h3 className="font-medium truncate">{canvas.name}</h3>
                    )}
                    <p className="text-sm text-white/40 mt-0.5">
                      {canvas.nodes.length} nodes · Updated {formatDate(canvas.updatedAt)}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleDuplicate(canvas.id, e)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4 text-white/50" />
                    </button>
                    <button
                      onClick={(e) => handleExport(canvas.id, e)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      title="Export"
                    >
                      <FileDown className="w-4 h-4 text-white/50" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(canvas.id, e)}
                      className="p-2 rounded-lg hover:bg-accent-coral/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-accent-coral/70" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Click outside to close menu */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setMenuOpen(null)} 
        />
      )}
    </div>
  )
}

