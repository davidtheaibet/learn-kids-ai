// Mason - AI Image Generator
export async function generateStoryImage(prompt) {
  const enhanced = `children's book illustration: ${prompt}, colorful, friendly, whimsical, kids storybook style`;
  return { success: false, fallback: true }; // Placeholder for SD integration
}

export function getThemeGradient(theme) {
  const themes = {
    adventure: 'from-orange-400 to-red-500',
    animals: 'from-green-400 to-teal-500',
    space: 'from-purple-900 to-blue-900',
    princess: 'from-pink-300 to-purple-400',
    pirates: 'from-blue-500 to-cyan-500',
    dinosaurs: 'from-green-600 to-emerald-500'
  };
  return themes[theme] || 'from-kids-purple to-kids-pink';
}
