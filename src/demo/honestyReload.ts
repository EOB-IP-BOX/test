/** DEMO generation-guard helpers mirroring Platform web honesty reloads. */

export type HonestyReloadOutcome = 'replaced' | 'kept' | 'missed'

export type HonestyReloadNote = {
  generation: number
  at: string
  outcome: HonestyReloadOutcome
  surface: string
}

export function bumpHonestyGeneration(current: number): number {
  return current + 1
}

export function honestyReloadNote(
  surface: string,
  generation: number,
  outcome: HonestyReloadOutcome,
): HonestyReloadNote {
  return {
    surface,
    generation,
    outcome,
    at: new Date().toISOString(),
  }
}

export function honestyReloadLabel(surface: string): string {
  return `Re-read ${surface}`
}

export const HUB_STATIC_URL = 'https://eob-ip-box.github.io/test/'
export const HUB_STATIC_PASSWORD = 'Alma'
