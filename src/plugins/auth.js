import store from '@/store'

function authPermission(permission) {
  const all_permission = "*:*:*";
  const permissions = store.getters && store.getters.permissions
  if (permission && permission.length > 0) {
    return permissions.some(v => {
      return all_permission === v || v === permission
    })
  } else {
    return false
  }
}

function authRole(role) {
  const super_admin = "admin";
  const roles = store.getters && store.getters.roles
  if (role && role.length > 0) {
    return roles.some(v => {
      return super_admin === v || v === role
    })
  } else {
    return false
  }
}

export default {
  // Verify whether the user has certain permissions
  hasPermi(permission) {
    return authPermission(permission);
  },
  // Verify whether the user has the specified permissions, only need to include one of them
  hasPermiOr(permissions) {
    return permissions.some(item => {
      return authPermission(item)
    })
  },
  // Verify whether the user has the specified permissions, which must all be owned
  hasPermiAnd(permissions) {
    return permissions.every(item => {
      return authPermission(item)
    })
  },
  // Verify whether the user has a certain role
  hasRole(role) {
    return authRole(role);
  },
  // Verify whether the user has the specified role, only one of them needs to be included
  hasRoleOr(roles) {
    return roles.some(item => {
      return authRole(item)
    })
  },
  // Verify whether the user has the specified role, which must all be owned
  hasRoleAnd(roles) {
    return roles.every(item => {
      return authRole(item)
    })
  }
}
