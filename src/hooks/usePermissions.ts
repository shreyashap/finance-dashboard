import { useRole } from './useRole'

export function usePermissions() {
  const { role } = useRole()

  return {
    canAdd: role === 'admin',
    canEdit: role === 'admin',
    canDelete: role === 'admin',
    isViewer: role === 'viewer',
  }
}
