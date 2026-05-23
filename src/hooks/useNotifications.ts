import { useEffect, useCallback } from 'react'
import { useTaskStore } from '../store/taskStore'

const hasNotificationAPI = typeof window !== 'undefined' && 'Notification' in window

export function useNotifications() {
  const tasks = useTaskStore((s) => s.tasks)

  const requestPermission = useCallback(async () => {
    if (!hasNotificationAPI) return 'denied'
    if (Notification.permission === 'granted') return 'granted'
    return Notification.requestPermission()
  }, [])

  // Poll every minute to check for due reminders
  useEffect(() => {
    if (!hasNotificationAPI) return

    const check = () => {
      if (Notification.permission !== 'granted') return
      const now = new Date()
      tasks.forEach((task) => {
        if (!task.reminderAt || task.completed) return
        const reminderTime = new Date(task.reminderAt)
        const diffMs = reminderTime.getTime() - now.getTime()
        // Fire if reminder is within the next 60 seconds and not in the past beyond 60s
        if (diffMs >= 0 && diffMs <= 60_000) {
          new Notification(`Reminder: ${task.title}`, {
            body: task.description ?? task.dueDate ? `Due: ${formatDate(task.dueDate!)}` : '',
            icon: '/pwa-192x192.png',
          })
        }
      })
    }

    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [tasks])

  return {
    requestPermission,
    permission: hasNotificationAPI ? Notification.permission : 'denied',
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
