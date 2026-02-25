// Hunter - Voice Engine for Text-to-Speech
// Uses Web Speech API with ElevenLabs fallback

export class VoiceEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.selectedVoice = null;
    this.isSpeaking = false;
    
    // Load voices
    this.loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = this.loadVoices.bind(this);
    }
  }
  
  loadVoices() {
    this.voices = this.synth.getVoices();
    // Prefer friendly voices
    this.selectedVoice = this.voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Karen') || 
      v.name.includes('Google UK English Female') ||
      v.name.includes('Victoria')
    ) || this.voices[0];
  }
  
  speak(text, onEnd) {
    if (!this.synth || this.isSpeaking) return;
    
    this.isSpeaking = true;
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    
    utterance.pitch = 1.2; // Slightly higher for friendliness
    utterance.rate = 0.9;  // Slightly slower for kids
    utterance.volume = 1;
    
    utterance.onend = () => {
      this.isSpeaking = false;
      onEnd?.();
    };
    
    utterance.onerror = () => {
      this.isSpeaking = false;
    };
    
    this.synth.speak(utterance);
  }
  
  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }
  
  pause() {
    if (this.synth) this.synth.pause();
  }
  
  resume() {
    if (this.synth) this.synth.resume();
  }
}

export function getSoundEffects() {
  return {
    storyStart: { emoji: '🎵', description: 'Magical chime' },
    storyEnd: { emoji: '🎉', description: 'Celebration' },
    pageTurn: { emoji: '📖', description: 'Page flip' },
    success: { emoji: '✨', description: 'Success chime' },
    click: { emoji: '🔘', description: 'Button click' }
  };
}
