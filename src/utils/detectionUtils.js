// Mock AI detection functions - in real app, these would connect to ML model

export const simulateDetection = (mode = 'day') => {
  // Simulate different detection scenarios based on mode
  const baseDetections = [
    { 
      type: 'person', 
      confidence: Math.floor(Math.random() * 20) + 75,
      distance: `${Math.floor(Math.random() * 30) + 5}m`,
      threatLevel: Math.random() > 0.7 ? 'medium' : 'low'
    },
    { 
      type: 'animal', 
      confidence: Math.floor(Math.random() * 25) + 70,
      distance: `${Math.floor(Math.random() * 15) + 3}m`,
      threatLevel: Math.random() > 0.8 ? 'medium' : 'low'
    }
  ];

  // Add more detections at night
  if (mode === 'night') {
    baseDetections.push({
      type: 'vehicle',
      confidence: Math.floor(Math.random() * 30) + 65,
      distance: `${Math.floor(Math.random() * 40) + 10}m`,
      threatLevel: 'low'
    });
  }

  // Randomly add a high threat detection (10% chance)
  if (Math.random() > 0.9) {
    baseDetections.push({
      type: 'suspicious_person',
      confidence: Math.floor(Math.random() * 15) + 80,
      distance: `${Math.floor(Math.random() * 10) + 2}m`,
      threatLevel: 'high'
    });
  }

  return baseDetections;
};

export const calculateSafetyScore = (detections) => {
  if (!detections || detections.length === 0) return { score: 100, level: 'safe' };

  let score = 100;
  
  detections.forEach(detection => {
    switch(detection.threatLevel) {
      case 'high':
        score -= 40;
        break;
      case 'medium':
        score -= 20;
        break;
      case 'low':
        score -= 5;
        break;
    }
  });

  score = Math.max(0, Math.min(100, score));

  let level = 'safe';
  if (score < 30) level = 'danger';
  else if (score < 70) level = 'caution';

  return { score, level };
};

export const generateRecommendations = (detections, mode) => {
  const recommendations = [];
  
  const hasHighThreat = detections.some(d => d.threatLevel === 'high');
  const hasMediumThreat = detections.some(d => d.threatLevel === 'medium');
  const hasPerson = detections.some(d => d.type.includes('person'));
  const hasAnimal = detections.some(d => d.type === 'animal');

  if (hasHighThreat) {
    recommendations.push('⚠️ HIGH THREAT DETECTED - DO NOT EXIT');
    recommendations.push('Consider contacting authorities');
    recommendations.push('Stay in a secure location');
  } else if (hasMediumThreat) {
    recommendations.push('Wait 5-10 minutes before exiting');
    recommendations.push('Have your phone ready for emergency call');
    recommendations.push('Let someone know you\'re going outside');
  }

  if (hasPerson && hasMediumThreat) {
    recommendations.push('Avoid direct confrontation');
    recommendations.push('Use a different exit if possible');
  }

  if (hasAnimal) {
    recommendations.push('Carry an animal deterrent if available');
    recommendations.push('Avoid sudden movements');
  }

  if (mode === 'night') {
    recommendations.push('Use flashlight feature');
    recommendations.push('Stay in well-lit areas');
    recommendations.push('Wear reflective clothing if possible');
  }

  if (recommendations.length === 0) {
    recommendations.push('Area appears clear');
    recommendations.push('Proceed with normal caution');
    recommendations.push('Stay aware of your surroundings');
  }

  return recommendations.slice(0, 5); // Limit to 5 recommendations
};