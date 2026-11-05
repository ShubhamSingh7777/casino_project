import React from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/** Wraps the PWA `beforeinstallprompt` flow. `canInstall` is false when installed or unsupported. */
export const useInstallPrompt = () => {
  const [event, setEvent] = React.useState<BeforeInstallPromptEvent | null>(null)

  React.useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setEvent(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => setEvent(null)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const install = React.useCallback(async () => {
    if (!event) return
    await event.prompt()
    await event.userChoice
    setEvent(null)
  }, [event])

  return { canInstall: !!event, install }
}
