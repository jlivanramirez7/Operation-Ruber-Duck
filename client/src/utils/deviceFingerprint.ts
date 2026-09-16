/**
 * Cruise-Ship NAT-Safe Device Fingerprinting & Cooldown Manager
 * Generates a persistent, privacy-preserving device fingerprint hash so multiple
 * passengers on the ship's shared Starlink/VSAT NAT IP can log ducks concurrently,
 * while preventing a single device from spamming the same duck multiple times within 1 hour.
 */

const TOKEN_STORAGE_KEY = 'cruiseduck_device_fingerprint_v1';
const COOLDOWN_STORAGE_KEY = 'cruiseduck_device_cooldowns_v1';
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

export function getDeviceFingerprintHash(): string {
  try {
    const existing = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (existing && existing.length >= 12) {
      return existing;
    }
    const randomPart = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    const screenInfo = `${window.screen?.width || 0}x${window.screen?.height || 0}_${navigator.language || 'en'}`;
    const raw = `fp_${screenInfo}_${randomPart}`;
    localStorage.setItem(TOKEN_STORAGE_KEY, raw);
    return raw;
  } catch {
    return `fp_fallback_${Date.now()}`;
  }
}

export function checkLocalDuckCooldown(duckId: string): { allowed: boolean; minutesLeft: number } {
  try {
    const cleanId = duckId.toUpperCase().trim();
    const raw = localStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (!raw) return { allowed: true, minutesLeft: 0 };

    const records = JSON.parse(raw) as Record<string, number>;
    const lastMs = records[cleanId];
    if (!lastMs) return { allowed: true, minutesLeft: 0 };

    const elapsed = Date.now() - lastMs;
    if (elapsed < COOLDOWN_MS) {
      return {
        allowed: false,
        minutesLeft: Math.ceil((COOLDOWN_MS - elapsed) / 60000)
      };
    }
    return { allowed: true, minutesLeft: 0 };
  } catch {
    return { allowed: true, minutesLeft: 0 };
  }
}

const HAS_SUBMITTED_KEY = 'cruiseduck_has_submitted_any_v1';

export function recordLocalDuckSubmission(duckId: string): void {
  try {
    const cleanId = duckId.toUpperCase().trim();
    const raw = localStorage.getItem(COOLDOWN_STORAGE_KEY);
    const records: Record<string, number> = raw ? JSON.parse(raw) : {};
    records[cleanId] = Date.now();
    localStorage.setItem(COOLDOWN_STORAGE_KEY, JSON.stringify(records));
    localStorage.setItem(HAS_SUBMITTED_KEY, 'true');
  } catch {
    // ignore storage errors in private browsing
  }
}

export function hasDeviceSubmittedBefore(): boolean {
  try {
    if (localStorage.getItem(HAS_SUBMITTED_KEY) === 'true') {
      return true;
    }
    const raw = localStorage.getItem(COOLDOWN_STORAGE_KEY);
    if (!raw) return false;
    const records = JSON.parse(raw) as Record<string, number>;
    return Object.keys(records).length > 0;
  } catch {
    return false;
  }
}

export function clearLocalDeviceSubmissionHistory(): void {
  try {
    localStorage.removeItem(COOLDOWN_STORAGE_KEY);
    localStorage.removeItem(HAS_SUBMITTED_KEY);
  } catch {
    // ignore
  }
}
