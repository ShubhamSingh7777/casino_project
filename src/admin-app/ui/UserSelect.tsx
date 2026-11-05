import React from 'react'
import userService from '../../services/user.service'
import { useClickOutside } from '../../user-app/hooks/useClickOutside'
import { inputClass } from './Button'

export type UserOption = { _id: string; username: string; [key: string]: any }

/** Async user typeahead (get-user-list-suggestion), shared by report filters and the header search. */
export const UserSelect = ({
  value,
  onChange,
  placeholder = 'Search By Client Name',
  dark,
}: {
  value: UserOption | null
  onChange: (user: UserOption | null) => void
  placeholder?: string
  /** translucent header style */
  dark?: boolean
}) => {
  const [query, setQuery] = React.useState(value?.username || '')
  const [options, setOptions] = React.useState<UserOption[]>([])
  const [open, setOpen] = React.useState(false)
  const [active, setActive] = React.useState(0)
  const ref = React.useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setOpen(false), open)

  React.useEffect(() => setQuery(value?.username || ''), [value])

  React.useEffect(() => {
    const q = query.trim()
    if (!open || !q || q === value?.username) return
    let cancelled = false
    const id = window.setTimeout(() => {
      userService
        .getUserListSuggestion({ username: q })
        .then((res: any) => !cancelled && (setOptions(res?.data?.data || []), setActive(0)))
        .catch(() => !cancelled && setOptions([]))
    }, 250)
    return () => {
      cancelled = true
      window.clearTimeout(id)
    }
  }, [query, open])

  const pick = (u: UserOption) => {
    onChange(u)
    setQuery(u.username)
    setOpen(false)
  }

  return (
    <div ref={ref} className='tw-relative tw-w-full'>
      <input
        value={query}
        placeholder={placeholder}
        aria-label={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
          if (!e.target.value) onChange(null)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') setActive((a) => Math.min(a + 1, options.length - 1))
          if (e.key === 'ArrowUp') setActive((a) => Math.max(a - 1, 0))
          if (e.key === 'Enter' && options[active]) {
            e.preventDefault()
            pick(options[active])
          }
        }}
        className={
          dark
            ? 'tw-h-9 tw-w-full tw-rounded-full tw-border-0 tw-bg-white/15 tw-px-4 tw-text-[13px] tw-text-white tw-outline-none placeholder:tw-text-white/60'
            : inputClass
        }
      />
      {open && query.trim() && query !== value?.username && (
        <ul className='tw-absolute tw-left-0 tw-right-0 tw-top-10 tw-z-50 tw-m-0 tw-max-h-64 tw-list-none tw-overflow-y-auto tw-rounded tw-bg-white tw-p-0 tw-text-[13px] tw-text-[#212529] tw-shadow-xl'>
          {options.length ? (
            options.map((u, i) => (
              <li key={u._id || u.username}>
                <button
                  type='button'
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(u)}
                  className={`tw-block tw-w-full tw-px-3 tw-py-2 tw-text-left ${i === active ? 'tw-bg-[#0d6efd] tw-text-white' : ''}`}
                >
                  {u.username}
                </button>
              </li>
            ))
          ) : (
            <li className='tw-px-3 tw-py-2 tw-text-[#6c757d]'>List is empty.</li>
          )}
        </ul>
      )}
    </div>
  )
}
