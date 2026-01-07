export const hasPageAccess = (
  userFeatures: string[] = [],
  requiredFeature?: string
) => {
  if (!requiredFeature) return true
  return userFeatures.includes(requiredFeature)
}


// export const hasPageAccess = (
//   user: {
//     is_admin?: boolean
//     features?: string[]
//   },
//   requiredFeature?: string
// ): boolean => {
//   // ✅ ADMIN OVERRIDE
//   if (user?.is_admin) return true

//   // No feature required → public page
//   if (!requiredFeature) return true

//   return user?.features?.includes(requiredFeature) ?? false
// }
