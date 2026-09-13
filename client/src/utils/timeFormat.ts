/**
 * Automatic Timestamp Formatting Utility for CruiseDuck Tracker
 * Formats ISO timestamps into readable Cruise Ship Date, Time, and Relative ("X mins ago") strings.
 */

export function formatPinnedTimestamp(isoString?: string | null): {
  fullDateTime: string;
  shortDateTime: string;
  relative: string;
} {
  if (!isoString) {
    return {
      fullDateTime: 'Time not recorded',
      shortDateTime: 'N/A',
      relative: ''
    };
  }

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return {
      fullDateTime: isoString,
      shortDateTime: isoString,
      relative: ''
    };
  }

  const fullDateTime = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const shortDateTime = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  let relative = 'Just now';

  if (diffSec >= 60 && diffSec < 3600) {
    const mins = Math.floor(diffSec / 60);
    relative = `${mins}m ago`;
  } else if (diffSec >= 3600 && diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600);
    const remMins = Math.floor((diffSec % 3600) / 60);
    relative = remMins > 0 ? `${hours}h ${remMins}m ago` : `${hours}h ago`;
  } else if (diffSec >= 86400) {
    const days = Math.floor(diffSec / 86400);
    relative = `${days}d ago`;
  }

  return {
    fullDateTime,
    shortDateTime,
    relative
  };
}
