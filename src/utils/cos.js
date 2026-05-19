/**
 * Tencent Cloud COS Upload Utility
 */
import COS from 'cos-js-sdk-v5';

// COS configuration - all sensitive values are read from environment variables, never hardcode them
const cosConfig = {
  SecretId: process.env.VUE_APP_TENCENT_SECRET_ID,
  SecretKey: process.env.VUE_APP_TENCENT_SECRET_KEY,
  Bucket: process.env.VUE_APP_COS_BUCKET || 'web-1318283609',
  Region: process.env.VUE_APP_COS_REGION || 'ap-guangzhou',
};

// Validate that required config values are present
if (!cosConfig.SecretId || !cosConfig.SecretKey) {
  console.error('[COS] Missing Tencent Cloud credentials. Please check VUE_APP_TENCENT_SECRET_ID and VUE_APP_TENCENT_SECRET_KEY in your .env file.');
}

// 创建 COS 实例
const cos = new COS({
  SecretId: cosConfig.SecretId,
  SecretKey: cosConfig.SecretKey,
});

/**
 * Generate a unique filename to avoid collisions
 * @param {string} originalName Original filename
 * @returns {string} Unique filename
 */
function generateUniqueFileName(originalName) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName.substring(originalName.lastIndexOf('.'));
  return `${timestamp}_${random}${ext}`;
}

/**
 * Upload a file to Tencent Cloud COS
 * @param {File} file File object to upload
 * @param {Function} onProgress Progress callback (percent: 0-100)
 * @returns {Promise<string>} Resolves with the file's public access URL
 */
export function uploadToCOS(file, onProgress) {
  return new Promise((resolve, reject) => {
    const uniqueFileName = generateUniqueFileName(file.name);
    const key = `AIFile/${uniqueFileName}`;

    cos.uploadFile({
      Bucket: cosConfig.Bucket,
      Region: cosConfig.Region,
      Key: key,
      Body: file,
      onProgress: (progressData) => {
        if (onProgress) {
          onProgress(Math.round(progressData.percent * 100));
        }
      },
    }, (err, data) => {
      if (err) {
        console.error('[COS] Upload failed:', err);
        reject(err);
      } else {
        const url = `https://${cosConfig.Bucket}.cos.${cosConfig.Region}.myqcloud.com/${key}`;
        resolve(url);
      }
    });
  });
}

export default {
  uploadToCOS,
};
