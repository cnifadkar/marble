'use client'

import { useCallback, useState } from 'react'
import { useCanvasStore, CanvasNode } from '@/store/canvasStore'
import { CheckCircle2, Circle, ListTodo, Plus } from 'lucide-react'

interface Task {
  id: string
  text: string
  completed: boolean
}

interface TaskNodeProps {
  node: CanvasNode
}

export function TaskNode({ node }: TaskNodeProps) {
  const { updateNode } = useCanvasStore()
  const [newTask, setNewTask] = useState('')

  // Parse tasks from content
  const parseTasks = (): Task[] => {
    if (!node.content) return []
    return node.content.split('\n').filter(Boolean).map((line, idx) => ({
      id: `task-${idx}`,
      text: line.replace(/^\[[ x]\] /, ''),
      completed: line.startsWith('[x] '),
    }))
  }

  const tasks = parseTasks()

  const serializeTasks = (taskList: Task[]): string => {
    return taskList.map(t => `[${t.completed ? 'x' : ' '}] ${t.text}`).join('\n')
  }

  const toggleTask = useCallback((taskId: string) => {
    const updated = tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    )
    updateNode(node.id, { content: serializeTasks(updated) })
  }, [tasks, node.id, updateNode])

  const addTask = useCallback(() => {
    if (!newTask.trim()) return
    const updated = [...tasks, { id: `task-${Date.now()}`, text: newTask.trim(), completed: false }]
    updateNode(node.id, { content: serializeTasks(updated) })
    setNewTask('')
  }, [newTask, tasks, node.id, updateNode])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTask()
    }
  }, [addTask])

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/40">
          <ListTodo className="w-3.5 h-3.5" />
          <span className="text-xs uppercase tracking-wider">Tasks</span>
        </div>
        {tasks.length > 0 && (
          <span className="text-xs text-white/30">
            {completedCount}/{tasks.length}
          </span>
        )}
      </div>

      <div className="space-y-1">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
          >
            {task.completed ? (
              <CheckCircle2 className="w-4 h-4 text-accent-mint flex-shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-white/30 flex-shrink-0" />
            )}
            <span className={`text-sm ${task.completed ? 'text-white/40 line-through' : 'text-white/80'}`}>
              {task.text}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-white/80 placeholder:text-white/20"
        />
        <button
          onClick={addTask}
          className="p-1 rounded hover:bg-white/10 transition-colors"
        >
          <Plus className="w-4 h-4 text-white/40" />
        </button>
      </div>
    </div>
  )
}

