import { useNotifications } from '../hooks/useNotifications'

export function NotificationBanner() {
  const { requestPermission, permission } = useNotifications()

  if (permission === 'granted' || permission === 'denied') return null

  return (
    <div className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl px-4 py-2.5 text-sm">
      <span className="text-indigo-700 dark:text-indigo-300">Enable notifications to get reminder alerts</span>
      <button
        onClick={requestPermission}
        className="ml-4 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex-shrink-0"
      >
        Enable
      </button>
    </div>
  )
}
