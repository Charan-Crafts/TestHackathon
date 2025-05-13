/**
 * Generates and downloads a certificate for hackathon participants
 * @param {Object} options Certificate generation options
 * @param {string} options.teamName Team name
 * @param {string} options.hackathonTitle Hackathon title
 * @param {string} options.rank Team's rank (e.g., "4th Place")
 * @param {string} options.achievement Special achievement or award (e.g., "Most Innovative Solution")
 * @param {string} options.logo URL of the hackathon logo (optional)
 * @returns {Promise<HTMLCanvasElement>} The generated certificate canvas
 */
export const generateCertificate = async ({
  teamName = 'CodeCrafters',
  hackathonTitle = 'AI Innovation Challenge',
  rank = '4th Place',
  achievement = 'Most Innovative Solution',
  logo = null
}) => {
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');
  
  // Certificate background with gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#1f2937');
  gradient.addColorStop(1, '#111827');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add subtle pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 20) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 20) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
  
  // Decorative corner elements
  const cornerSize = 100;
  const drawCorner = (x, y, rotate) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotate * Math.PI / 180);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(cornerSize, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, cornerSize);
    ctx.stroke();
    ctx.restore();
  };
  
  drawCorner(50, 50, 0);
  drawCorner(canvas.width - 50, 50, 90);
  drawCorner(50, canvas.height - 50, -90);
  drawCorner(canvas.width - 50, canvas.height - 50, 180);
  
  // Gold border with double lines
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
  
  // Load and draw logo if provided
  if (logo) {
    try {
      const logoImg = await loadImage(logo);
      const logoSize = 120;
      ctx.drawImage(
        logoImg,
        canvas.width / 2 - logoSize / 2,
        80,
        logoSize,
        logoSize
      );
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  }
  
  // Certificate title with shadow
  ctx.shadowColor = 'rgba(251, 191, 36, 0.5)';
  ctx.shadowBlur = 20;
  ctx.font = 'bold 60px "Segoe UI", Arial';
  ctx.fillStyle = '#fbbf24';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE', canvas.width / 2, logo ? 260 : 150);
  ctx.fillText('OF ACHIEVEMENT', canvas.width / 2, logo ? 330 : 220);
  ctx.shadowBlur = 0;
  
  // Decorative line
  const lineY = logo ? 370 : 260;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 200, lineY);
  ctx.lineTo(canvas.width / 2 + 200, lineY);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Hackathon name
  ctx.font = 'bold 36px "Segoe UI", Arial';
  ctx.fillStyle = '#e5e7eb';
  ctx.fillText(hackathonTitle, canvas.width / 2, logo ? 420 : 310);
  
  // Award text with elegant font
  ctx.font = 'italic 32px "Segoe UI", Arial';
  ctx.fillStyle = '#e5e7eb';
  ctx.fillText('This certifies that', canvas.width / 2, logo ? 480 : 370);
  
  // Team name with gradient
  const teamGradient = ctx.createLinearGradient(
    canvas.width / 2 - 200,
    0,
    canvas.width / 2 + 200,
    0
  );
  teamGradient.addColorStop(0, '#60a5fa');
  teamGradient.addColorStop(1, '#93c5fd');
  ctx.font = 'bold 48px "Segoe UI", Arial';
  ctx.fillStyle = teamGradient;
  ctx.fillText(teamName, canvas.width / 2, logo ? 550 : 440);
  
  // Achievement text with improved layout
  ctx.font = '28px "Segoe UI", Arial';
  ctx.fillStyle = '#e5e7eb';
  ctx.fillText('Has successfully completed the hackathon and earned', canvas.width / 2, logo ? 620 : 510);
  ctx.font = 'bold 32px "Segoe UI", Arial';
  ctx.fillText(`recognition for "${achievement}"`, canvas.width / 2, logo ? 670 : 560);
  ctx.fillText(`Rank: ${rank}`, canvas.width / 2, logo ? 720 : 610);
  
  // Date with decorative elements
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  ctx.font = '24px "Segoe UI", Arial';
  ctx.fillText(`Issued on ${dateStr}`, canvas.width / 2, logo ? 780 : 670);
  
  // Add signature lines
  const signatureY = logo ? 820 : 710;
  ctx.strokeStyle = '#4b5563';
  ctx.lineWidth = 1;
  
  // Left signature
  ctx.beginPath();
  ctx.moveTo(200, signatureY);
  ctx.lineTo(400, signatureY);
  ctx.stroke();
  ctx.font = '18px "Segoe UI", Arial';
  ctx.fillStyle = '#9ca3af';
  ctx.fillText('Organizer Signature', 300, signatureY + 30);
  
  // Right signature
  ctx.beginPath();
  ctx.moveTo(800, signatureY);
  ctx.lineTo(1000, signatureY);
  ctx.stroke();
  ctx.fillText('Judge Signature', 900, signatureY + 30);
  
  return canvas;
};

// Helper function to load images
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}; 