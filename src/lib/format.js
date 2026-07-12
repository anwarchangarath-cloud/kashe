// AED price formatting — two decimals, grouped thousands.
export function formatAed(value) {
  return value.toLocaleString('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
