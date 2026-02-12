import { browser } from 'wxt/browser';
import type { UserMeasurements } from './types';

const STORAGE_KEY = 'userMeasurements';

/** Retrieves saved user measurements. Returns null if none exist. */
export async function getUserMeasurements(): Promise<UserMeasurements | null> {
  const result = await browser.storage.local.get(STORAGE_KEY);
  const stored = result[STORAGE_KEY];
  return (stored as UserMeasurements | undefined) ?? null;
}

/** Saves user measurements to Chrome storage. */
export async function saveUserMeasurements(
  measurements: UserMeasurements
): Promise<void> {
  await browser.storage.local.set({ [STORAGE_KEY]: measurements });
}

/** Returns true if user measurements exist in storage. */
export async function hasMeasurements(): Promise<boolean> {
  const result = await browser.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] != null;
}

/** Removes saved user measurements from storage. */
export async function clearMeasurements(): Promise<void> {
  await browser.storage.local.remove(STORAGE_KEY);
}
