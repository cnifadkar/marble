'use client'

import { useCanvasStore } from '@/store/canvasStore'

export function ConnectionLines() {
  const { nodes, connections } = useCanvasStore()

  if (connections.length === 0) return null

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(167, 139, 250, 0.5)" />
          <stop offset="100%" stopColor="rgba(78, 205, 196, 0.5)" />
        </linearGradient>
      </defs>
      
      {connections.map((connection) => {
        const fromNode = nodes.find(n => n.id === connection.fromId)
        const toNode = nodes.find(n => n.id === connection.toId)
        
        if (!fromNode || !toNode) return null
        
        const fromX = fromNode.x + fromNode.width / 2
        const fromY = fromNode.y + fromNode.height / 2
        const toX = toNode.x + toNode.width / 2
        const toY = toNode.y + toNode.height / 2
        
        // Calculate control points for a smooth curve
        const midX = (fromX + toX) / 2
        const midY = (fromY + toY) / 2
        const dx = toX - fromX
        const dy = toY - fromY
        const offset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.3
        
        const path = `M ${fromX} ${fromY} Q ${midX} ${midY - offset} ${toX} ${toY}`
        
        return (
          <g key={connection.id}>
            {/* Glow effect */}
            <path
              d={path}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.2"
              filter="blur(4px)"
            />
            {/* Main line */}
            <path
              d={path}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="8 4"
            />
          </g>
        )
      })}
    </svg>
  )
}

