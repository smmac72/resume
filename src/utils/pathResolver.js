/**
 * Path resolver utility for the virtual file system
 * Handles path resolution for cd command, including relative paths, absolute paths, and special notations
 */

// Resolve a path relative to a current path
export const resolvePath = (currentPath, newPath) => {
  // If newPath is absolute (starts with /), just use it
  if (newPath.startsWith('/')) {
    return normalizePath(newPath);
  }
  
  // Handle special cases
  if (newPath === '.') {
    return currentPath;
  }
  
  if (newPath === '..') {
    return goUpOneLevel(currentPath);
  }
  
  // For relative paths, combine with current path
  let base = currentPath;
  
  // Make sure the base ends with a slash
  if (!base.endsWith('/')) {
    base += '/';
  }
  
  // Handle multiple path segments (e.g., dir1/dir2/dir3)
  const segments = newPath.split('/');
  
  for (const segment of segments) {
    if (segment === '') continue;
    if (segment === '.') continue;
    if (segment === '..') {
      base = goUpOneLevel(base);
    } else {
      base += segment + '/';
    }
  }
  
  return normalizePath(base);
};

// Go up one level in the path
const goUpOneLevel = (path) => {
  // If we're at root, stay at root
  if (path === '/' || path === '') {
    return '/';
  }
  
  // Remove trailing slash if present
  if (path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  
  // Find the last slash
  const lastSlashIndex = path.lastIndexOf('/');
  
  // If no slash found, return root
  if (lastSlashIndex === -1) {
    return '/';
  }
  
  // If the slash is at the beginning, return root
  if (lastSlashIndex === 0) {
    return '/';
  }
  
  // Otherwise, return the path up to the last slash
  return path.slice(0, lastSlashIndex);
};

// Normalize a path (remove duplicate slashes, handle . and ..)
const normalizePath = (path) => {
  // Ensure path starts with a slash
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  // Split path into segments
  const segments = path.split('/').filter(segment => segment.length > 0);
  const result = [];
  
  // Process each segment
  for (const segment of segments) {
    if (segment === '.') {
      // Current directory, skip
      continue;
    } else if (segment === '..') {
      // Parent directory, remove last segment if possible
      if (result.length > 0) {
        result.pop();
      }
    } else {
      // Regular segment, add to result
      result.push(segment);
    }
  }
  
  // Construct normalized path
  return '/' + result.join('/');
};

// Get the parent directory of a path
export const getParentPath = (path) => {
  return goUpOneLevel(path);
};

// Get the last segment of a path (file or directory name)
export const getLastSegment = (path) => {
  // Remove trailing slash if present
  if (path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  
  // Find the last slash
  const lastSlashIndex = path.lastIndexOf('/');
  
  // If no slash found or slash is at the end, return empty string
  if (lastSlashIndex === -1 || lastSlashIndex === path.length - 1) {
    return '';
  }
  
  // Return the part after the last slash
  return path.slice(lastSlashIndex + 1);
};

// Check if a path is absolute
export const isAbsolutePath = (path) => {
  return path.startsWith('/');
};

// Combine two paths
export const combinePaths = (basePath, relativePath) => {
  return resolvePath(basePath, relativePath);
};
