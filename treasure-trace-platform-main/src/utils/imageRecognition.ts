import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to always download models
env.allowLocalModels = false;
env.useBrowserCache = false;

// Initialize the image classification pipeline
let imageClassifier: any = null;

// Minimum similarity threshold for considering images to be potential matches
const SIMILARITY_THRESHOLD = 0.65;

// Load the model
const initializeImageRecognition = async () => {
  try {
    console.log('Initializing image recognition model...');
    imageClassifier = await pipeline(
      'image-classification',
      'Xenova/vit-base-patch16-224',
      { device: 'webgpu' }
    );
    console.log('Image recognition model loaded successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize image recognition model:', error);
    return false;
  }
};

// Analyze image and return classification
export const analyzeImage = async (imageData: string): Promise<{
  topMatch: { className: string; confidence: number } | null;
  allMatches: Array<{ className: string; confidence: number }>;
  featureVector?: number[];
}> => {
  try {
    // Initialize if not already
    if (!imageClassifier) {
      await initializeImageRecognition();
    }

    // Run inference
    console.log('Analyzing image...');
    const result = await imageClassifier(imageData);
    console.log('Image analysis result:', result);

    // Format results
    const formattedResults = result.map((item: any) => ({
      className: item.label || '',
      confidence: item.score || 0
    }));

    // Fix TypeScript error with feature vectors by properly typing the conversion
    const featureVector = result.length > 0 && result[0].hidden_state 
      ? Array.from(result[0].hidden_state).map(Number)  // Explicitly convert to number[]
      : undefined;

    return {
      topMatch: formattedResults.length > 0 ? formattedResults[0] : null,
      allMatches: formattedResults,
      featureVector
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      topMatch: null,
      allMatches: []
    };
  }
};

// Function to compare two images and return similarity score
export const compareImages = async (image1: string, image2: string): Promise<number> => {
  try {
    const analysis1 = await analyzeImage(image1);
    const analysis2 = await analyzeImage(image2);
    
    let similarityScore = 0;
    
    // Basic implementation: check if top classifications match
    if (analysis1.topMatch && analysis2.topMatch) {
      // Match by class name - gives full score if exact match
      if (analysis1.topMatch.className === analysis2.topMatch.className) {
        similarityScore = 0.8; // Base score for same classification
        
        // Add more confidence based on confidence scores
        const confidenceFactor = analysis1.topMatch.confidence * analysis2.topMatch.confidence;
        similarityScore += confidenceFactor * 0.2;
      } else {
        // Check for partial matches across all classifications
        for (const match1 of analysis1.allMatches) {
          for (const match2 of analysis2.allMatches) {
            if (match1.className === match2.className) {
              // Add partial similarity based on confidence
              similarityScore += match1.confidence * match2.confidence * 0.5;
            }
          }
        }
      }
    }
    
    return Math.min(similarityScore, 1.0); // Ensure score is between 0 and 1
  } catch (error) {
    console.error('Error comparing images:', error);
    return 0;
  }
};

// Function to find potential matches between a target image and a list of images
export const findPotentialMatches = async (
  targetImage: string,
  candidateImages: Array<{ id: string; imageData: string; metadata?: any }>
): Promise<Array<{ id: string; similarity: number; metadata?: any }>> => {
  try {
    // Get matches and sort by similarity score (descending)
    const matches = await Promise.all(
      candidateImages.map(async (candidate) => {
        const similarity = await compareImages(targetImage, candidate.imageData);
        return {
          id: candidate.id,
          similarity,
          metadata: candidate.metadata
        };
      })
    );

    // Filter matches that meet the threshold and sort by similarity (descending)
    return matches
      .filter(match => match.similarity >= SIMILARITY_THRESHOLD)
      .sort((a, b) => b.similarity - a.similarity);
  } catch (error) {
    console.error('Error finding potential matches:', error);
    return [];
  }
};

// Function to generate a text description of the image based on its classifications
export const generateImageDescription = async (imageData: string): Promise<string> => {
  try {
    const analysis = await analyzeImage(imageData);
    
    if (!analysis.topMatch) {
      return "Unrecognized item";
    }
    
    // Build a description based on the top 3 matches
    const topMatches = analysis.allMatches.slice(0, 3);
    
    if (topMatches.length === 1) {
      return `This appears to be a ${topMatches[0].className.toLowerCase()}`;
    }
    
    // For multiple matches, create a more nuanced description
    const primaryClass = topMatches[0].className.toLowerCase();
    const secondaryClasses = topMatches.slice(1)
      .map(match => `${match.className.toLowerCase()} (${Math.round(match.confidence * 100)}% confidence)`)
      .join(' or possibly a ');
    
    return `This appears to be a ${primaryClass} (${Math.round(topMatches[0].confidence * 100)}% confidence), or possibly a ${secondaryClasses}`;
  } catch (error) {
    console.error('Error generating image description:', error);
    return "Could not generate description";
  }
};

// Export the initialization function
export default initializeImageRecognition;
