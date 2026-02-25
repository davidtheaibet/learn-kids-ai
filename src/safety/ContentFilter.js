// Jaxon - Safety Content Filter
// COPPA Compliant Content Moderation

const BLOCKED_WORDS = [
  'fuck', 'shit', 'damn', 'ass', 'bitch', 'bastard',
  'kill', 'murder', 'die', 'death', 'blood', 'gun', 'knife',
  'sex', 'porn', 'naked', 'drug',
  'zombie', 'demon', 'devil'
];

const REPLACEMENTS = {
  'kill': 'stop', 'murder': 'catch', 'die': 'sleep',
  'death': 'rest', 'blood': 'paint', 'gun': 'toy',
  'knife': 'spoon', 'demon': 'shadow', 'devil': 'trickster'
};

export function sanitizeInput(text) {
  if (!text || typeof text !== 'string') {
    return { safe: false, text: '', reason: 'Invalid input' };
  }
  
  const lowerText = text.toLowerCase();
  const foundBlocked = BLOCKED_WORDS.filter(word => lowerText.includes(word));
  
  if (foundBlocked.length > 0) {
    let sanitized = text;
    let replaced = 0;
    
    foundBlocked.forEach(word => {
      if (REPLACEMENTS[word]) {
        sanitized = sanitized.replace(new RegExp(word, 'gi'), REPLACEMENTS[word]);
        replaced++;
      }
    });
    
    if (replaced === foundBlocked.length) {
      return { safe: true, text: sanitized, modified: true };
    }
    
    return { safe: false, text: '', reason: 'Inappropriate content detected' };
  }
  
  return { safe: true, text, modified: false };
}

export function sanitizeOutput(text) {
  if (!text) return text;
  let sanitized = text;
  
  BLOCKED_WORDS.forEach(word => {
    if (REPLACEMENTS[word]) {
      sanitized = sanitized.replace(new RegExp(`\\b${word}\\b`, 'gi'), REPLACEMENTS[word]);
    }
  });
  
  return sanitized;
}
