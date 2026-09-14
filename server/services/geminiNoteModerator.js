/**
 * Gemini AI Background Note Moderator & Family-Safe Rewriter
 * Operation Rubber Duck - CruiseDuck Tracker
 *
 * Runs in the background whenever a finder submits an optional note:
 * 1. Strictly enforces a 5-word maximum.
 * 2. Uses Google Gemini (`gemini-2.5-flash`) + instant family-safe deterministic guardrails
 *    to scrub and rewrite any inappropriate, profane, negative, or PII content into a
 *    cheerful 3-5 word Caribbean cruise celebration.
 */

const CHEERFUL_CRUISE_REWRITES = [
  'Loving this sunny cruise! 🌴',
  'Best vacation day ever! 🦆',
  'Happy sailing from deck! 🚢',
  'Found by the pool! ☀️',
  'Cruising the Caribbean seas! 🌊',
  'Ahoy fellow duck hunters! ⚓'
];

// Comprehensive family-safety blocklist (profanity, adult themes, insults, PII indicators)
const INAPPROPRIATE_PATTERNS = [
  /\b(fuck|shit|bitch|ass|asshole|damn|hell|crap|dick|piss|cock|pussy|slut|whore|bastard|wtf|stfu|suck|sucks|stupid|idiot|hate|kill|die|sex|naked|nude|drunk|wasted|weed|drugs|beer|booze|horny|porn)\b/i,
  /\b(\d{3}[-.]?\d{3}[-.]?\d{4})\b/, // Phone numbers (PII)
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i // Email addresses (PII)
];

/**
 * Truncates any string to a maximum of 5 words.
 */
function enforceMaxFiveWords(text) {
  if (!text || typeof text !== 'string') return '';
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 5) return words.join(' ');
  return words.slice(0, 5).join(' ');
}

/**
 * Deterministic check for any inappropriate or PII content.
 */
function containsInappropriateContent(text) {
  if (!text || typeof text !== 'string') return false;
  return INAPPROPRIATE_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Picks a deterministic cheerful 4-word cruise phrase based on input hash.
 */
function getCheerfulRewrite(seedText = '') {
  let hash = 0;
  for (let i = 0; i < seedText.length; i++) {
    hash = (hash * 31 + seedText.charCodeAt(i)) % CHEERFUL_CRUISE_REWRITES.length;
  }
  return CHEERFUL_CRUISE_REWRITES[Math.abs(hash) % CHEERFUL_CRUISE_REWRITES.length];
}

/**
 * Moderates and rewrites a user note using Google Gemini AI (`gemini-2.5-flash`)
 * with instant family-safe fallback and strict 5-word enforcement.
 *
 * @param {string} rawNote - Raw user input note
 * @returns {Promise<{ finalNote: string, wasRewritten: boolean, reason: string, moderatedBy: string }>}
 */
async function moderateAndRewriteNote(rawNote) {
  if (!rawNote || typeof rawNote !== 'string' || !rawNote.trim()) {
    return {
      finalNote: '',
      wasRewritten: false,
      reason: 'empty',
      moderatedBy: 'gemini-background-agent'
    };
  }

  const trimmed = rawNote.trim();
  const isLocallyFlagged = containsInappropriateContent(trimmed);
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a family-friendly Caribbean cruise scavenger hunt moderator for kids and parents.
Read the user's short note below:
User note: "${trimmed}"

Rules:
1. Maximum 5 words strictly.
2. If the note is already clean, positive, family-friendly, and 5 words or fewer, return it unchanged.
3. If the note is longer than 5 words, condense it to 5 cheerful words or fewer.
4. If the note contains ANY profanity, insults, adult themes, alcohol/drug references, negative vibes, or personal info (phone/email), rewrite it completely into a cheerful 4-5 word Caribbean cruise celebration (for example: "Loving this sunny cruise! 🌴" or "Best vacation day ever! 🦆").
5. Output ONLY the final 1-5 word note, nothing else.`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 25
            }
          }),
          signal: AbortSignal.timeout(2500)
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (candidateText) {
          const cleanedAiText = candidateText.replace(/^["']|["']$/g, '').trim();
          const finalAiNote = containsInappropriateContent(cleanedAiText)
            ? getCheerfulRewrite(trimmed)
            : enforceMaxFiveWords(cleanedAiText);

          return {
            finalNote: finalAiNote,
            wasRewritten: finalAiNote !== trimmed,
            reason: isLocallyFlagged
              ? 'inappropriate_scrubbed'
              : wordCount > 5
              ? 'condensed_to_5_words'
              : finalAiNote !== trimmed
              ? 'gemini_polished'
              : 'clean',
            moderatedBy: 'gemini-2.5-flash'
          };
        }
      }
    } catch (err) {
      // Fall through to deterministic AI safety guardrails
    }
  }

  // Deterministic Family-Safe Guardrail & 5-Word Rewriter
  if (isLocallyFlagged) {
    const rewritten = getCheerfulRewrite(trimmed);
    return {
      finalNote: rewritten,
      wasRewritten: true,
      reason: 'inappropriate_scrubbed',
      moderatedBy: 'gemini-safety-shield'
    };
  }

  const capped = enforceMaxFiveWords(trimmed);
  return {
    finalNote: capped,
    wasRewritten: capped !== trimmed,
    reason: capped !== trimmed ? 'condensed_to_5_words' : 'clean',
    moderatedBy: 'gemini-safety-shield'
  };
}

module.exports = {
  moderateAndRewriteNote,
  enforceMaxFiveWords,
  containsInappropriateContent
};
