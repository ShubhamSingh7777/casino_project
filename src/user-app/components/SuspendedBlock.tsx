import React from 'react'

/** One gray block in place of odds cells (suspended runner or whole market). Not clickable. */
export const SuspendedBlock = ({ className = '' }: { className?: string }) => (
  <div
    className={`tw-flex tw-items-center tw-justify-center tw-rounded-md tw-bg-suspended tw-text-meta tw-font-semibold tw-text-suspended-fg ${className}`}
  >
    Suspended
  </div>
)
