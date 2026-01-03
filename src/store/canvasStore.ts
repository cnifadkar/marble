import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export type NodeType = 'note' | 'image' | 'link' | 'code' | 'task'

export interface CanvasNode {
  id: string
  type: NodeType
  x: number
  y: number
  width: number
  height: number
  content: string
  color?: string
  isEditing?: boolean
  zIndex: number
  createdAt: string
}

export interface Connection {
  id: string
  fromId: string
  toId: string
  color?: string
}

export interface CanvasData {
  id: string
  name: string
  nodes: CanvasNode[]
  connections: Connection[]
  createdAt: string
  updatedAt: string
  zoom: number
  panX: number
  panY: number
}

interface CanvasState {
  // All canvases
  canvases: CanvasData[]
  currentCanvasId: string | null
  
  // Current canvas state (derived from currentCanvasId)
  nodes: CanvasNode[]
  connections: Connection[]
  selectedNodeId: string | null
  zoom: number
  panX: number
  panY: number
  maxZIndex: number
  
  // Canvas management
  createCanvas: (name?: string) => string
  deleteCanvas: (id: string) => void
  renameCanvas: (id: string, name: string) => void
  duplicateCanvas: (id: string) => string
  switchCanvas: (id: string) => void
  
  // Node actions
  addNode: (type: NodeType, x: number, y: number, content?: string) => void
  updateNode: (id: string, updates: Partial<CanvasNode>) => void
  deleteNode: (id: string) => void
  selectNode: (id: string | null) => void
  bringToFront: (id: string) => void
  
  // Connection actions
  addConnection: (fromId: string, toId: string) => void
  deleteConnection: (id: string) => void
  
  // View actions
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  resetView: () => void
  
  // Utility
  saveCurrentCanvas: () => void
  exportCanvas: () => string
  importCanvas: (data: string) => void
  clearCanvas: () => void
}

const NODE_COLORS = ['coral', 'mint', 'lavender', 'amber', 'rose', 'sky']
const getRandomColor = () => NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)]

const DEFAULT_SIZES: Record<NodeType, { width: number; height: number }> = {
  note: { width: 280, height: 180 },
  image: { width: 300, height: 200 },
  link: { width: 320, height: 100 },
  code: { width: 400, height: 200 },
  task: { width: 280, height: 120 },
}

function getDefaultContent(type: NodeType): string {
  switch (type) {
    case 'note': return ''
    case 'code': return '// Start typing your code...'
    case 'task': return '[ ] New task'
    case 'link': return 'https://'
    case 'image': return ''
    default: return ''
  }
}

function createEmptyCanvas(name: string = 'Untitled Canvas'): CanvasData {
  return {
    id: uuidv4(),
    name,
    nodes: [],
    connections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    zoom: 1,
    panX: 0,
    panY: 0,
  }
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      canvases: [],
      currentCanvasId: null,
      nodes: [],
      connections: [],
      selectedNodeId: null,
      zoom: 1,
      panX: 0,
      panY: 0,
      maxZIndex: 0,

      createCanvas: (name = 'Untitled Canvas') => {
        const newCanvas = createEmptyCanvas(name)
        set((state) => ({
          canvases: [...state.canvases, newCanvas],
          currentCanvasId: newCanvas.id,
          nodes: [],
          connections: [],
          selectedNodeId: null,
          zoom: 1,
          panX: 0,
          panY: 0,
          maxZIndex: 0,
        }))
        return newCanvas.id
      },

      deleteCanvas: (id) => {
        const { canvases, currentCanvasId } = get()
        const newCanvases = canvases.filter((c) => c.id !== id)
        
        if (currentCanvasId === id) {
          const nextCanvas = newCanvases[0]
          if (nextCanvas) {
            set({
              canvases: newCanvases,
              currentCanvasId: nextCanvas.id,
              nodes: nextCanvas.nodes,
              connections: nextCanvas.connections,
              zoom: nextCanvas.zoom,
              panX: nextCanvas.panX,
              panY: nextCanvas.panY,
              maxZIndex: Math.max(0, ...nextCanvas.nodes.map((n) => n.zIndex)),
            })
          } else {
            set({
              canvases: [],
              currentCanvasId: null,
              nodes: [],
              connections: [],
              zoom: 1,
              panX: 0,
              panY: 0,
              maxZIndex: 0,
            })
          }
        } else {
          set({ canvases: newCanvases })
        }
      },

      renameCanvas: (id, name) => {
        set((state) => ({
          canvases: state.canvases.map((c) =>
            c.id === id ? { ...c, name, updatedAt: new Date().toISOString() } : c
          ),
        }))
      },

      duplicateCanvas: (id) => {
        const { canvases } = get()
        const canvas = canvases.find((c) => c.id === id)
        if (!canvas) return ''
        
        const newCanvas: CanvasData = {
          ...canvas,
          id: uuidv4(),
          name: `${canvas.name} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          nodes: canvas.nodes.map((n) => ({ ...n, id: uuidv4() })),
          connections: [], // Reset connections since node IDs changed
        }
        
        set((state) => ({
          canvases: [...state.canvases, newCanvas],
        }))
        return newCanvas.id
      },

      switchCanvas: (id) => {
        const { canvases, currentCanvasId, nodes, connections, zoom, panX, panY } = get()
        
        // Save current canvas first
        if (currentCanvasId) {
          const updatedCanvases = canvases.map((c) =>
            c.id === currentCanvasId
              ? { ...c, nodes, connections, zoom, panX, panY, updatedAt: new Date().toISOString() }
              : c
          )
          set({ canvases: updatedCanvases })
        }
        
        // Load new canvas
        const canvas = get().canvases.find((c) => c.id === id)
        if (canvas) {
          set({
            currentCanvasId: id,
            nodes: canvas.nodes,
            connections: canvas.connections,
            zoom: canvas.zoom,
            panX: canvas.panX,
            panY: canvas.panY,
            selectedNodeId: null,
            maxZIndex: Math.max(0, ...canvas.nodes.map((n) => n.zIndex)),
          })
        }
      },

      addNode: (type, x, y, content = '') => {
        const { maxZIndex } = get()
        const newZIndex = maxZIndex + 1
        const size = DEFAULT_SIZES[type]
        
        const newNode: CanvasNode = {
          id: uuidv4(),
          type,
          x,
          y,
          width: size.width,
          height: size.height,
          content: content || getDefaultContent(type),
          color: getRandomColor(),
          isEditing: type === 'note',
          zIndex: newZIndex,
          createdAt: new Date().toISOString(),
        }
        
        set((state) => ({
          nodes: [...state.nodes, newNode],
          selectedNodeId: newNode.id,
          maxZIndex: newZIndex,
        }))
        
        // Auto-save
        get().saveCurrentCanvas()
      },

      updateNode: (id, updates) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === id ? { ...node, ...updates } : node
          ),
        }))
        // Debounced auto-save would be better in production
        get().saveCurrentCanvas()
      },

      deleteNode: (id) => {
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== id),
          connections: state.connections.filter(
            (conn) => conn.fromId !== id && conn.toId !== id
          ),
          selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
        }))
        get().saveCurrentCanvas()
      },

      selectNode: (id) => {
        set({ selectedNodeId: id })
      },

      bringToFront: (id) => {
        const { maxZIndex } = get()
        const newZIndex = maxZIndex + 1
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === id ? { ...node, zIndex: newZIndex } : node
          ),
          maxZIndex: newZIndex,
        }))
      },

      addConnection: (fromId, toId) => {
        const newConnection: Connection = {
          id: uuidv4(),
          fromId,
          toId,
          color: 'lavender',
        }
        set((state) => ({
          connections: [...state.connections, newConnection],
        }))
        get().saveCurrentCanvas()
      },

      deleteConnection: (id) => {
        set((state) => ({
          connections: state.connections.filter((conn) => conn.id !== id),
        }))
        get().saveCurrentCanvas()
      },

      setZoom: (zoom) => {
        set({ zoom: Math.max(0.25, Math.min(2, zoom)) })
      },

      setPan: (x, y) => {
        set({ panX: x, panY: y })
      },

      resetView: () => {
        set({ zoom: 1, panX: 0, panY: 0 })
      },

      saveCurrentCanvas: () => {
        const { canvases, currentCanvasId, nodes, connections, zoom, panX, panY } = get()
        if (!currentCanvasId) return
        
        set({
          canvases: canvases.map((c) =>
            c.id === currentCanvasId
              ? { ...c, nodes, connections, zoom, panX, panY, updatedAt: new Date().toISOString() }
              : c
          ),
        })
      },

      exportCanvas: () => {
        const { canvases, currentCanvasId, nodes, connections, zoom, panX, panY } = get()
        const currentCanvas = canvases.find((c) => c.id === currentCanvasId)
        
        const exportData = {
          name: currentCanvas?.name || 'Untitled',
          nodes,
          connections,
          zoom,
          panX,
          panY,
          exportedAt: new Date().toISOString(),
          version: '1.0',
        }
        
        return JSON.stringify(exportData, null, 2)
      },

      importCanvas: (data) => {
        try {
          const parsed = JSON.parse(data)
          const newCanvas = createEmptyCanvas(parsed.name || 'Imported Canvas')
          newCanvas.nodes = parsed.nodes || []
          newCanvas.connections = parsed.connections || []
          newCanvas.zoom = parsed.zoom || 1
          newCanvas.panX = parsed.panX || 0
          newCanvas.panY = parsed.panY || 0
          
          set((state) => ({
            canvases: [...state.canvases, newCanvas],
            currentCanvasId: newCanvas.id,
            nodes: newCanvas.nodes,
            connections: newCanvas.connections,
            zoom: newCanvas.zoom,
            panX: newCanvas.panX,
            panY: newCanvas.panY,
            maxZIndex: Math.max(0, ...newCanvas.nodes.map((n) => n.zIndex)),
          }))
        } catch (e) {
          console.error('Failed to import canvas:', e)
        }
      },

      clearCanvas: () => {
        set({
          nodes: [],
          connections: [],
          selectedNodeId: null,
          maxZIndex: 0,
        })
        get().saveCurrentCanvas()
      },
    }),
    {
      name: 'marble-storage',
      partialize: (state) => ({
        canvases: state.canvases,
        currentCanvasId: state.currentCanvasId,
      }),
      onRehydrateStorage: () => (state) => {
        // Load the current canvas data after rehydration
        if (state && state.currentCanvasId) {
          const canvas = state.canvases.find((c) => c.id === state.currentCanvasId)
          if (canvas) {
            state.nodes = canvas.nodes
            state.connections = canvas.connections
            state.zoom = canvas.zoom
            state.panX = canvas.panX
            state.panY = canvas.panY
            state.maxZIndex = Math.max(0, ...canvas.nodes.map((n) => n.zIndex))
          }
        }
      },
    }
  )
)
