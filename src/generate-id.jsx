let counter = 0

/**
 * Generates a process-unique identifier for table headers, rows, and columns.
 *
 * Uses a module-level counter instead of `uuid` so the package bundles cleanly
 * under Metro / react-native-web, where `uuid` v9's ESM wrapper fails to resolve.
 * @returns {string} A process-unique identifier.
 */
export default function generateId() {
  counter += 1

  return `tabloom-${counter}`
}
