import { useState } from 'react';
import { motion } from 'framer-motion';

export default function StorybookExporter({ story, theme, character, onExport }) {
  const [format, setFormat] = useState('pdf');
  
  const handleExport = () => {
    const storyData = {
      title: `My ${character} Adventure`,
      story,
      theme,
      character,
      date: new Date().toLocaleDateString(),
      author: 'Created with LearnKidsAI'
    };
    
    // Create printable version
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${storyData.title}</title>
          <style>
            body { font-family: Arial; max-width: 600px; margin: 40px auto; padding: 20px; }
            h1 { color: #6C5CE7; text-align: center; }
            .story { font-size: 18px; line-height: 1.8; margin: 30px 0; }
            .footer { text-align: center; color: #999; margin-top: 40px; }
          </style>
        </head>
        <body>
          <h1>📚 ${storyData.title}</h1>
          <div class="story">${story.replace(/\n/g, '<br>')}</div>
          <div class="footer">
            <p>Created on ${storyData.date}</p>
            <p>${storyData.author}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    
    onExport?.();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-kids-purple mt-6"
    >
      <h3 className="font-bold text-kids-purple text-lg mb-3">📖 Save Your Story</h3>
      <p className="text-gray-600 text-sm mb-4">
        Print or save this story to keep forever!
      </p>
      <button
        onClick={handleExport}
        className="w-full bg-kids-green text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors"
      >
        🖨️ Print / Save as PDF
      </button>
    </motion.div>
  );
}
