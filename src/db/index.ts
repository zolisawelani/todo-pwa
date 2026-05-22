import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  dueDate?: string // ISO string
  reminderAt?: string // ISO string
  createdAt: string
  updatedAt: string
}

interface TodoDB extends DBSchema {
  tasks: {
    key: string
    value: Task
    indexes: { 'by-due': string; 'by-created': string }
  }
}

let db: IDBPDatabase<TodoDB>

export async function getDB() {
  if (!db) {
    db = await openDB<TodoDB>('todo-pwa', 1, {
      upgrade(database) {
        const store = database.createObjectStore('tasks', { keyPath: 'id' })
        store.createIndex('by-due', 'dueDate')
        store.createIndex('by-created', 'createdAt')
      },
    })
  }
  return db
}

export async function getAllTasks(): Promise<Task[]> {
  const database = await getDB()
  return database.getAll('tasks')
}

export async function putTask(task: Task): Promise<void> {
  const database = await getDB()
  await database.put('tasks', task)
}

export async function deleteTask(id: string): Promise<void> {
  const database = await getDB()
  await database.delete('tasks', id)
}
