import { create } from 'zustand'
import { type Task, getAllTasks, putTask, deleteTask } from '../db'
import { nanoid } from '../lib/nanoid'

export type Filter = 'all' | 'active' | 'completed'

interface TaskStore {
  tasks: Task[]
  filter: Filter
  hydrated: boolean
  hydrate: () => Promise<void>
  addTask: (data: Pick<Task, 'title' | 'description' | 'dueDate' | 'reminderAt'>) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  updateTask: (id: string, data: Partial<Task>) => Promise<void>
  removeTask: (id: string) => Promise<void>
  setFilter: (filter: Filter) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  filter: 'all',
  hydrated: false,

  hydrate: async () => {
    const tasks = await getAllTasks()
    set({ tasks, hydrated: true })
  },

  addTask: async (data) => {
    const now = new Date().toISOString()
    const task: Task = {
      id: nanoid(),
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      reminderAt: data.reminderAt,
      completed: false,
      createdAt: now,
      updatedAt: now,
    }
    await putTask(task)
    set((s) => ({ tasks: [task, ...s.tasks] }))
  },

  toggleTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return
    const updated = { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
    await putTask(updated)
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? updated : t)) }))
  },

  updateTask: async (id, data) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return
    const updated = { ...task, ...data, updatedAt: new Date().toISOString() }
    await putTask(updated)
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? updated : t)) }))
  },

  removeTask: async (id) => {
    await deleteTask(id)
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
  },

  setFilter: (filter) => set({ filter }),
}))
