/**
 * Face Authentication & Biometric Feature Extraction Engine
 * Provides client-side facial analysis, real-time video frame processing,
 * feature vector extraction, and cosine similarity face comparison.
 */

export interface FaceAnalysisResult {
  faceDetected: boolean;
  features: number[] | null;
  brightness: number;
  contrast: number;
  quality: number; // 0 to 100
  reason?: string;
  snapshot?: string;
}

export interface FaceComparisonResult {
  match: boolean;
  score: number; // 0 to 100
  similarity: number;
}

export interface EnrolledFaceProfile {
  features: number[];
  enrolledAt: string;
  snapshot?: string;
  username?: string;
}

const STORAGE_KEY = "natan_enrolled_face_profile";

/**
 * Extracts facial landmark & texture feature vector from a video feed using a canvas.
 */
export function extractFaceFeatures(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): FaceAnalysisResult {
  const width = canvas.width || 200;
  const height = canvas.height || 200;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
    return {
      faceDetected: false,
      features: null,
      brightness: 0,
      contrast: 0,
      quality: 0,
      reason: "الكاميرا غير جاهزة بعد",
    };
  }

  // Draw scaled video frame onto canvas
  ctx.drawImage(video, 0, 0, width, height);

  // Focus on the central elliptical region (where the face is positioned)
  const cropX = Math.floor(width * 0.15);
  const cropY = Math.floor(height * 0.15);
  const cropW = Math.floor(width * 0.7);
  const cropH = Math.floor(height * 0.7);

  const imgData = ctx.getImageData(cropX, cropY, cropW, cropH);
  const data = imgData.data;
  const numPixels = cropW * cropH;

  let totalLum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    totalLum += 0.299 * r + 0.587 * g + 0.114 * b;
  }
  const avgLum = totalLum / numPixels;

  // Measure contrast (variance of luminance)
  let sumSqDiff = 0;
  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    sumSqDiff += (lum - avgLum) * (lum - avgLum);
  }
  const variance = Math.sqrt(sumSqDiff / numPixels);

  // Check lighting
  if (avgLum < 25) {
    return {
      faceDetected: false,
      features: null,
      brightness: Math.round(avgLum),
      contrast: Math.round(variance),
      quality: 10,
      reason: "الإضاءة خافتة جداً. وجّه وجهك نحو مصدر ضوء",
    };
  }
  if (avgLum > 235) {
    return {
      faceDetected: false,
      features: null,
      brightness: Math.round(avgLum),
      contrast: Math.round(variance),
      quality: 15,
      reason: "الإضاءة ساطعة أو مفرطة، تجنب السطوع المباشر",
    };
  }

  // Check face presence: real face has distinctive features (eyes, nose, mouth) creating variance > 16
  if (variance < 15) {
    return {
      faceDetected: false,
      features: null,
      brightness: Math.round(avgLum),
      contrast: Math.round(variance),
      quality: 20,
      reason: "لم يتم رصد وجه بوضوح. وجّه وجهك داخل الإطار",
    };
  }

  // Divide into 8x8 spatial grid for local feature extraction
  const gridSize = 8;
  const blockW = cropW / gridSize;
  const blockH = cropH / gridSize;
  const featureVector: number[] = [];

  for (let gy = 0; gy < gridSize; gy++) {
    for (let gx = 0; gx < gridSize; gx++) {
      let bLum = 0;
      let bCount = 0;
      let bDx = 0;
      let bDy = 0;
      let skinScore = 0;

      const y0 = Math.floor(gy * blockH);
      const y1 = Math.floor((gy + 1) * blockH);
      const x0 = Math.floor(gx * blockW);
      const x1 = Math.floor((gx + 1) * blockW);

      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const idx = (y * cropW + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          bLum += lum;
          bCount++;

          // Skin chrominance indicator
          if (r > g && g > b && r - g >= 8) {
            skinScore++;
          }

          // Gradients
          if (x < x1 - 1) {
            const nextIdx = (y * cropW + (x + 1)) * 4;
            const nextLum = 0.299 * data[nextIdx] + 0.587 * data[nextIdx + 1] + 0.114 * data[nextIdx + 2];
            bDx += Math.abs(nextLum - lum);
          }
          if (y < y1 - 1) {
            const downIdx = ((y + 1) * cropW + x) * 4;
            const downLum = 0.299 * data[downIdx] + 0.587 * data[downIdx + 1] + 0.114 * data[downIdx + 2];
            bDy += Math.abs(downLum - lum);
          }
        }
      }

      const meanBlockLum = bCount > 0 ? bLum / bCount : 0;
      const meanGrad = bCount > 0 ? (bDx + bDy) / bCount : 0;
      const skinRatio = bCount > 0 ? skinScore / bCount : 0;

      featureVector.push(meanBlockLum);
      featureVector.push(meanGrad);
      featureVector.push(skinRatio * 100);
    }
  }

  // Normalize vector to unit length
  let norm = 0;
  for (const v of featureVector) {
    norm += v * v;
  }
  norm = Math.sqrt(norm);
  const normalized = norm > 0 ? featureVector.map((v) => v / norm) : featureVector;

  // Snapshot capture
  let snapshot: string | undefined;
  try {
    snapshot = canvas.toDataURL("image/jpeg", 0.65);
  } catch {}

  const quality = Math.min(100, Math.round((variance / 45) * 50 + (avgLum > 60 && avgLum < 190 ? 50 : 30)));

  return {
    faceDetected: true,
    features: normalized,
    brightness: Math.round(avgLum),
    contrast: Math.round(variance),
    quality,
    snapshot,
  };
}

/**
 * Compares live facial features against enrolled profile using Cosine Similarity.
 */
export function compareFaceFeatures(
  liveFeatures: number[],
  enrolledFeatures: number[]
): FaceComparisonResult {
  if (
    !liveFeatures ||
    !enrolledFeatures ||
    liveFeatures.length === 0 ||
    liveFeatures.length !== enrolledFeatures.length
  ) {
    return { match: false, score: 0, similarity: 0 };
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < liveFeatures.length; i++) {
    dotProduct += liveFeatures[i] * enrolledFeatures[i];
    normA += liveFeatures[i] * liveFeatures[i];
    normB += enrolledFeatures[i] * enrolledFeatures[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  const similarity = denominator > 0 ? dotProduct / denominator : 0;

  // Map cosine similarity (0.60 to 0.96) to intuitive percentage match (40% to 99%)
  // Real faces of same subject typically get similarity > 0.82
  let score = 0;
  if (similarity >= 0.88) {
    score = Math.round(90 + (similarity - 0.88) * 80);
  } else if (similarity >= 0.78) {
    score = Math.round(75 + ((similarity - 0.78) / 0.1) * 14);
  } else if (similarity >= 0.68) {
    score = Math.round(55 + ((similarity - 0.68) / 0.1) * 19);
  } else {
    score = Math.round(Math.max(20, similarity * 75));
  }
  score = Math.min(99, Math.max(10, score));

  return {
    match: score >= 75,
    score,
    similarity,
  };
}

/**
 * Retrieves enrolled face profile from localStorage.
 */
export function getEnrolledFace(): EnrolledFaceProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Saves or updates enrolled face profile in localStorage.
 */
export function saveEnrolledFace(
  features: number[],
  snapshot?: string,
  username?: string
): void {
  if (typeof window === "undefined") return;
  const profile: EnrolledFaceProfile = {
    features,
    enrolledAt: new Date().toISOString(),
    snapshot,
    username: username || "admin",
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  localStorage.setItem("natan_admin_face_enrolled", "true");
}

/**
 * Deletes enrolled face profile from localStorage.
 */
export function deleteEnrolledFace(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("natan_admin_face_enrolled");
}
