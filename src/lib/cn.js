// Tiny classnames joiner — filters falsy values. Keeps component markup readable
// without pulling in a dependency.
export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}
