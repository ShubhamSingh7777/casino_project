import User, { RoleType } from '../models/User'
import { useAppSelector } from '../redux/hooks'
import { selectUserData } from '../redux/actions/login/loginSlice'
import { readAdminDemo, useAdminDemo } from '../shared/dev-auth'

/** Admin side of the dev demo login (src/shared/dev-auth.ts). */
export { readAdminDemo, useAdminDemo }

/** Logged-in role, or `admin` during the demo session (shows the full menu and every page). */
export const effectiveRole = (user: User, demo = readAdminDemo()) => user.role || (demo ? RoleType.admin : undefined)

export const useAdminRole = () => {
  const demo = useAdminDemo()
  return effectiveRole(useAppSelector<{ user: User }>(selectUserData).user, demo)
}
