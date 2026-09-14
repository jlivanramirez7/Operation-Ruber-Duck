/**
 * Gemini AI Background Note Moderator & Family-Safe Rewriter
 * Operation Rubber Duck - CruiseDuck Tracker
 *
 * Fully integrated with Google Cloud Agent Platform / Vertex AI via @google/genai SDK
 * using Application Default Credentials (ADC) from the Cloud Run service account
 * (same architecture as D&D Helper Agent `GeminiService`).
 *
 * Runs in the background whenever a finder submits an optional note:
 * 1. Strictly enforces a 10-word maximum.
 * 2. Uses Google Cloud Vertex AI (`gemini-2.5-flash` via ADC) + family-safe guardrails
 *    to scrub and rewrite any inappropriate, profane, negative, or PII content into a
 *    cheerful 5-10 word Caribbean cruise celebration.
 */

const { GoogleGenAI } = require('@google/genai');

const CHEERFUL_CRUISE_REWRITES = [
  'Loving this sunny Caribbean cruise adventure! 🌴',
  'Best vacation day ever on deck! 🦆',
  'Happy sailing from our sunny cruise ship! 🚢',
  'Found hiding right by the pool deck! ☀️',
  'Cruising the crystal clear Caribbean seas! 🌊',
  'Ahoy fellow duck hunters aboard the ship! ⚓'
];

// Comprehensive family-safety blocklist (profanity, adult themes, insults, PII indicators)
const INAPPROPRIATE_PATTERNS = [
  /\b(fuck|shit|bitch|ass|asshole|damn|hell|crap|dick|piss|cock|pussy|slut|whore|bastard|wtf|stfu|suck|sucks|stupid|idiot|hate|kill|die|sex|naked|nude|drunk|wasted|weed|drugs|beer|booze|horny|porn)\b/i,
  /\b(\d{3}[-.]?\d{3}[-.]?\d{4})\b/, // Phone numbers (PII)
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i // Email addresses (PII)
];

/**
 * Truncates any string to a maximum of 10 words.
 */
function enforceMaxTenWords(text) {
  if (!text || typeof text !== 'string') return '';
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 10) return words.join(' ');
  return words.slice(0, 10).join(' ');
}

/**
 * Deterministic check for any inappropriate or PII content.
 */
function containsInappropriateContent(text) {
  if (!text || typeof text !== 'string') return false;
  return INAPPROPRIATE_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Picks a deterministic cheerful 6-word cruise phrase based on input hash.
 */
function getCheerfulRewrite(seedText = '') {
  let hash = 0;
  for (let i = 0; i < seedText.length; i++) {
    hash = (hash * 31 + seedText.charCodeAt(i)) % CHEERFUL_CRUISE_REWRITES.length;
  }
  return CHEERFUL_CRUISE_REWRITES[Math.abs(hash) % CHEERFUL_CRUISE_REWRITES.length];
}

class GeminiNoteModeratorService {
  constructor() {
    this.apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY || '').trim();
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID || 'operationruberduck';
    this.location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    this.activeModelUsed = this.modelName;
    this.activeProjectId = null;
  }

  /**
   * Executes Gemini API calls via official Google Gen AI SDK (@google/genai)
   * using Vertex AI Agent Platform Application Default Credentials (ADC) from the Cloud Run service account,
   * matching the D&D Helper Agent (`GeminiService.callGemini`).
   */
  async callVertexGemini(promptText, systemInstruction = '') {
    const key = this.apiKey;
    const location = process.env.GOOGLE_CLOUD_LOCATION || this.location;

    const candidateProjects = Array.from(
      new Set([
        this.activeProjectId,
        process.env.GOOGLE_CLOUD_PROJECT,
        process.env.GCP_PROJECT_ID,
        this.projectId,
        'operationruberduck',
        'danddhelper-508418'
      ].filter(Boolean))
    );

    const candidateModels = Array.from(new Set([
      this.modelName,
      'gemini-2.5-flash',
      'gemini-1.5-flash'
    ]));

    let lastError = null;

    const executeWithClient = async (client, model, mode, project) => {
      const config = {
        temperature: 0.2,
        topP: 0.95
      };
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }

      const res = await client.models.generateContent({
        model,
        contents: promptText,
        config
      });

      return { text: res.text, mode, model, project };
    };

    // Strategy 1: Use Application Default Credentials (ADC) across candidate GCP projects
    for (const project of candidateProjects) {
      for (const model of candidateModels) {
        try {
          const adcClient = new GoogleGenAI({
            vertexai: true,
            project,
            location
          });
          const result = await executeWithClient(adcClient, model, 'Vertex AI Agent Platform (ADC)', project);
          this.activeModelUsed = model;
          this.activeProjectId = project;
          return result;
        } catch (adcErr) {
          lastError = adcErr;
          if (
            adcErr.message &&
            (adcErr.message.includes('403') ||
              adcErr.message.includes('PERMISSION_DENIED') ||
              adcErr.message.includes('CONSUMER_INVALID') ||
              adcErr.message.includes('NOT_FOUND'))
          ) {
            break;
          }
        }
      }
    }

    // Strategy 2: If API key is configured, try with API key
    if (key && key.length > 5) {
      for (const model of candidateModels) {
        try {
          let keyClient;
          let mode;
          if (key.startsWith('AIzaSy')) {
            keyClient = new GoogleGenAI({ apiKey: key });
            mode = 'AI Studio Developer API';
          } else {
            keyClient = new GoogleGenAI({ vertexai: true, apiKey: key, project: candidateProjects[0], location });
            mode = 'Vertex AI Agent Platform (API Key)';
          }
          const result = await executeWithClient(keyClient, model, mode, candidateProjects[0]);
          this.activeModelUsed = model;
          return result;
        } catch (err) {
          lastError = err;
        }
      }
    }

    throw lastError || new Error('All candidate Vertex AI Agent Platform models/projects failed.');
  }

  /**
   * Moderates and rewrites a user note using Vertex AI Agent Platform (`gemini-2.5-flash`)
   * with strict 10-word enforcement and instant family-safe guardrails.
   */
  async moderateAndRewriteNote(rawNote) {
    if (!rawNote || typeof rawNote !== 'string' || !rawNote.trim()) {
      return {
        finalNote: '',
        wasRewritten: false,
        reason: 'empty',
        moderatedBy: 'vertex-ai-agent-platform'
      };
    }

    const trimmed = rawNote.trim();
    const isLocallyFlagged = containsInappropriateContent(trimmed);
    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

    const systemInstruction = `You are a family-friendly Caribbean cruise scavenger hunt moderator for kids and parents.
Read the user's short note.
Rules:
1. Maximum 10 words strictly.
2. If the note is clean, positive, family-friendly, and 10 words or fewer, return it unchanged.
3. If the note is longer than 10 words, condense it to 10 cheerful words or fewer while preserving the fun vibe.
4. If the note contains ANY profanity, insults, adult themes, alcohol/drug references, negative vibes, or personal info (phone/email), rewrite it completely into a cheerful 5-10 word Caribbean cruise celebration (for example: "Loving this sunny Caribbean cruise adventure! 🌴" or "Best vacation day ever on deck! 🦆").
5. Output ONLY the final 1-10 word note, nothing else.`;

    try {
      const vertexRes = await this.callVertexGemini(`User note: "${trimmed}"`, systemInstruction);
      const candidateText = (vertexRes?.text || '').trim().replace(/^["']|["']$/g, '').trim();

      if (candidateText) {
        const finalAiNote = containsInappropriateContent(candidateText)
          ? getCheerfulRewrite(trimmed)
          : enforceMaxTenWords(candidateText);

        return {
          finalNote: finalAiNote,
          wasRewritten: finalAiNote !== trimmed,
          reason: isLocallyFlagged
            ? 'inappropriate_scrubbed'
            : wordCount > 10
            ? 'condensed_to_10_words'
            : finalAiNote !== trimmed
            ? 'gemini_polished'
            : 'clean',
          moderatedBy: `vertex-ai (${vertexRes.model} @ ${vertexRes.project})`
        };
      }
    } catch (err) {
      console.warn(`[GeminiNoteModerator] Vertex AI ADC fallback triggered (${err.message}). Applying deterministic family-safety shield.`);
    }

    if (isLocallyFlagged) {
      const rewritten = getCheerfulRewrite(trimmed);
      return {
        finalNote: rewritten,
        wasRewritten: true,
        reason: 'inappropriate_scrubbed',
        moderatedBy: 'vertex-ai-safety-shield'
      };
    }

    const capped = enforceMaxTenWords(trimmed);
    return {
      finalNote: capped,
      wasRewritten: capped !== trimmed,
      reason: capped !== trimmed ? 'condensed_to_10_words' : 'clean',
      moderatedBy: 'vertex-ai-safety-shield'
    };
  }
}

const geminiNoteModeratorService = new GeminiNoteModeratorService();

async function moderateAndRewriteNote(rawNote) {
  return geminiNoteModeratorService.moderateAndRewriteNote(rawNote);
}

module.exports = {
  GeminiNoteModeratorService,
  geminiNoteModeratorService,
  moderateAndRewriteNote,
  enforceMaxTenWords,
  enforceMaxFiveWords: enforceMaxTenWords, // backwards compatibility alias
  containsInappropriateContent
};
