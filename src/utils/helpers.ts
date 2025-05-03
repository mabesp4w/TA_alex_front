/**
 * @format
 */

/**
 * Generates a unique ID for elements
 * @returns A unique string ID
 */
export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

/**
 * Format file size to human readable format
 * @param bytes - The file size in bytes
 * @returns Formatted file size string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Get file extension from file name
 * @param filename - The file name
 * @returns The file extension (without the dot)
 */
export const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

/**
 * Validate file type based on allowed extensions
 * @param file - The file to validate
 * @param allowedExtensions - Array of allowed extensions
 * @returns Boolean indicating if file type is valid
 */
export const validateFileType = (
  file: File,
  allowedExtensions: string[]
): boolean => {
  const extension = getFileExtension(file.name);
  return allowedExtensions.includes(extension);
};
