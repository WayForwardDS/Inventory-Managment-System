/**
 * User roles and their corresponding string values.
 */
export const UserRole = {
  Manager: 'Manager',
  SuperAdmin: 'SuperAdmin',
  StockManager: 'Stock-Manager', 
  Mixture: 'Mixture',
} as const;

/**
 * User statuses and their corresponding string values.
 */
export const UserStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  BLOCK: 'BLOCK',
} as const;

/**
 * Type representing all possible user roles.
 */
export type TUserRole = keyof typeof UserRole;

/**
 * Type representing all possible user statuses.
 */
export type TUserStatus = keyof typeof UserStatus;