/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { Role } from '../types'

interface RoleContextValue {
  role: Role
  setRole: (role: Role) => void
}

const storageKey = 'finance-dashboard-role-v1'
const RoleContext = createContext<RoleContextValue | null>(null)

function getInitialRole(): Role {
  const stored = localStorage.getItem(storageKey)
  return stored === 'admin' ? 'admin' : 'viewer'
}

export function RoleProvider({ children }: PropsWithChildren) {
  const [role, setRoleState] = useState<Role>(getInitialRole)

  const setRole = (nextRole: Role) => {
    setRoleState(nextRole)
    localStorage.setItem(storageKey, nextRole)
  }

  const value = useMemo(() => ({ role, setRole }), [role])

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRoleContext() {
  const context = useContext(RoleContext)

  if (!context) {
    throw new Error('useRoleContext must be used inside RoleProvider')
  }

  return context
}
