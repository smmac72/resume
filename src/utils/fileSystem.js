// File System class to handle the virtual file structure
import translations from './translations';
import analytics from './analytics';

class FileSystem {
  constructor() {
    this.root = this.initializeFileSystem();
    this.currentPath = '/';
    this.currentServer = null;
    this.authenticatedServers = {}; // Track servers we've authenticated with
    this.currentLanguage = 'en';
  }

  // Set current language
  setLanguage(lang) {
    if (lang === 'en' || lang === 'ru') {
      this.currentLanguage = lang;
    }
  }

  // Get translation
  translate(key) {
    return translations[this.currentLanguage]?.[key] || translations.en[key] || key;
  }

  // Get file content with translation
  getTranslatedFileContent(content) {
    // Check if the content has a translation key
    const contentKey = Object.keys(translations.en).find(key => translations.en[key] === content);
    if (contentKey) {
      return translations[this.currentLanguage][contentKey] || content;
    }
    return content;
  }

  // Initialize the file system with sample data
  initializeFileSystem() {
    return {
      servers: {
        '87.251.78.216': {
          name: 'Backup Server',
          username: 'guest',
          password: 'nopass',
          protected: false, // This server is accessible without auth
          root: {
            home: {
              'readme.txt': 'readme_backup',
              'linkedin.html': 'https://www.linkedin.com/in/oleg-bogomolov-035713335/',
              'hh.html': 'https://hh.ru/resume/aede5f73ff0b7f9f570039ed1f6d6a6736696c'
            },
            etc: {
              'logins.txt': 'logins_txt',
              'servers.conf': 'servers_conf',
            },
          },
          background: 'server1_bg.jpg',
        },
        '87.251.78.2': {
          name: 'Work Server',
          username: 'zeromac',
          password: 'naughtshad',
          protected: true, // This server requires authentication
          root: {
            projects: {
              'majestic.sh': 'timeline:majesticrp',
              'globalcity.sh': 'timeline:globalcity',
              'nextrp.sh': 'timeline:nextrp',
              'samprp.sh': 'timeline:samprp',
              'workreadme.txt': 'readme_projects',
            },
          },
          background: 'server2_bg.jpg',
        },
        '87.251.78.3': {
          name: 'Pet Projects',
          username: 'zeromac',
          password: 'allsspent',
          protected: true, // This server requires authentication
          root: {
            renderer: {
              'github.html': 'https://github.com/smmac72/zeroRender',
              'readme_render.txt': 'readme_renderer',
            },
            chernograd: {
              'steam.html': 'https://store.steampowered.com/app/3047300/CHERNOGRAD/',
              'readme_chernograd.txt': 'readme_chernograd',
              'firststreamer.png': 'image:firststreamer.jpg',
              'deck.png': 'image:deck.jpg',
              'rei.png': 'image:rei.jpg',
              'demorelease.png': 'image:release.jpg',
              'localization.png': 'image:localization.jpg',
            },
            tabletop: {
              'readme_tabletop.txt': 'readme_tabletop',
              'pitch.pptx': 'https://docs.google.com/presentation/d/1J4tuk1PBqaa_iccFenoiTlEkYEqwNX_MLkmcNfFSGdY/edit#slide=id.g2a8926ffb75_0_180',
              'rules.docx': 'https://docs.google.com/document/d/19DbA54xCZQKHBdRlbtjiAGJOyVrb8hMoPSZ3KZ85fto/edit?tab=t.0',
              'pnp.pdf': 'https://docs.google.com/presentation/d/19v1cJ2s1ihUtJwkHXWO1YGk-gcp6o7jutL2dYMVd7Z8/edit#slide=id.g28e64aa2097_0_206',
              'printedgame.png': 'image:tabletop.jpg',
            },
            web: {
              'github.html': 'https://github.com/smmac72/resume',
              'sluchka.html': 'http://sluchka.market',
              'readme_web.txt': 'readme_web',
              'oldsite.png': 'image:old_site.jpg',
            },
            gtao: {
              'balancedoc.xlsx': 'https://docs.google.com/spreadsheets/d/1oeNenv0Jt3pAe_Esq6SDZbESOZO94cTeWWO31des5Dw/edit?usp=sharing',
              'readme_gta.txt': 'readme_gtao',
            },
            telegrambots: {
              'github.html': 'https://github.com/smmac72/birthdaybot',
              'readme_birthday.txt': 'readme_birthday',
            },
            anticheat: {
              'github.html': 'https://github.com/smmac72/inputFilter',
              'readme_anticheat.txt': 'readme_anticheat',
            },
          },
          background: 'server3_bg.jpg',
        },
        '87.251.78.4': {
          name: 'Personal Server',
          username: 'zeromac',
          password: 'whereourdesire',
          protected: true, // This server requires authentication
          root: {
            personal: {
              'readme_my.txt': 'readme_personal',
              'favgames.txt': 'favgames_txt',
              'favmovies.txt': 'favmovies_txt',
              'favbooks.txt': 'favbooks_txt',
              'utils.txt': 'utils_txt',
            },
          },
          background: 'server3_bg.jpg',
        },
        '87.251.78.2160': {
          name: 'Meme Storage',
          username: 'guest',
          password: 'guest',
          protected: false, // Public access
          root: {
            memes: {
              'therearenoeastereggs.txt': 'therearenoeastereggs_txt',
              'meme1.png': 'image:meme1.jpg',
              'meme2.png': 'image:meme2.jpg',
              'meme3.png': 'image:meme3.jpg',
              'meme4.png': 'image:meme4.jpg',
              'meme5.png': 'image:meme5.jpg',
              'meme6.png': 'image:meme6.jpg',
              'meme7.png': 'image:meme7.jpg',
              'mozart.mp4': 'https://www.youtube.com/watch?v=3MU_6BPKmBg'
            },
          },
          background: 'server1_bg.jpg',
        },
        '87.251.78.24': {
          name: 'Nothing',
          username: 'guest',
          password: 'guest',
          protected: false, // Public access
          root: {
            void: {
              'nothingimportant.txt': 'nothingimportant_txt',
              'hiddenimage.png': 'image:meme8.jpg',
            },
          },
          background: 'server2_bg.jpg',
        },
        '87.251.78.69': {
          name: 'Absolute Top Secret Server',
          username: 'root',
          password: 'BYTHEMYRIADTRUTHS',
          protected: true, // Requires auth
          root: {
            secret: {
              'bruh.txt': 'bruh_txt',
              'vorkuta.png': 'image:vorkuta.jpg'
            },
          },
          background: 'server1_bg.jpg',
        },
      },
    };
  }

  getCurrentUser() {
    if (!this.currentServer) return 'guest';
    const auth = this.authenticatedServers[this.currentServer];
    return (auth && auth.username) ? auth.username : 'guest';
  }

  // Connect to a server
  connectToServer(ip) {
    if (this.root.servers[ip]) {
      // Always reset to root path when connecting to a server
      this.currentServer = ip;
      this.currentPath = '/';
      
      // If the server is not protected or we're already authenticated, return it directly
      if (!this.root.servers[ip].protected || this.authenticatedServers[ip]) {
        if (ip === '87.251.78.69') {
          import('./commandProcessor').then(module => {
            const commandProcessor = module.default;
            commandProcessor.unlockAchievement('secret_server_access', ip);
          });
        }
        return {
          success: true,
          server: {
            ...this.root.servers[ip],
            ip,
          },
        };
      }
      
      // Otherwise, return success but without server details until authenticated
      return {
        success: true,
        requiresAuth: true,
        server: {
          name: this.root.servers[ip].name,
          ip,
        },
      };
    }
    return {
      success: false,
      message: this.translate('file_not_found'),
    };
  }

  // Authenticate with a server
  authenticate(username, password) {
    if (!this.currentServer) {
      return {
        success: false,
        message: this.translate('not_connected_filesystem'),
      };
    }

    const server = this.root.servers[this.currentServer];
    if (server.username === username && server.password === password) {
      // Mark this server as authenticated
      this.authenticatedServers[this.currentServer] = {
        username: username,
        authenticated: true
      };
      
      return {
        success: true,
        server: {
          ...server,
          ip: this.currentServer,
          username,
        },
      };
    }

    return {
      success: false,
      message: this.translate('auth_fail'),
    };
  }

  // Resolve a path (handle ../, ./, etc.)
  resolvePath(path) {
    if (!this.currentServer) {
      return { success: false, message: this.translate('not_connected_filesystem') };
    }

    // Check if server is protected and we're not authenticated
    if (this.root.servers[this.currentServer].protected && 
        !this.authenticatedServers[this.currentServer]) {
      return { success: false, message: this.translate('auth_required_filesystem') };
    }

    // If path starts with /, it's an absolute path
    let resolvedPath = path.startsWith('/') ? path : this.currentPath + (this.currentPath.endsWith('/') ? '' : '/') + path;

    // Split the path into segments
    const segments = resolvedPath.split('/').filter(segment => segment.length > 0);
    const resultSegments = [];

    // Process each segment
    for (const segment of segments) {
      if (segment === '..') {
        // Go up one level if possible
        if (resultSegments.length > 0) {
          resultSegments.pop();
        }
      } else if (segment !== '.') {
        // Add segment if it's not current directory (.)
        resultSegments.push(segment);
      }
    }

    // Construct the resolved path
    resolvedPath = '/' + resultSegments.join('/');
    return { success: true, path: resolvedPath };
  }

  // Get current directory content
  getCurrentDirectoryContent() {
    if (!this.currentServer) {
      return { success: false, message: this.translate('not_connected_filesystem') };
    }

    // Check if server is protected and we're not authenticated
    if (this.root.servers[this.currentServer].protected && 
        (!this.authenticatedServers[this.currentServer] || 
         !this.authenticatedServers[this.currentServer].authenticated)) {
      return { success: false, message: this.translate('auth_required_filesystem') };
    }

    return this.getCurrentDirectoryContentForPath(this.currentPath);
  }
  
  // Get directory content for a specific path
  getCurrentDirectoryContentForPath(path) {
    if (!this.currentServer) {
      return { success: false, message: this.translate('not_connected_filesystem') };
    }

    // Check if server is protected and we're not authenticated
    if (this.root.servers[this.currentServer].protected && 
        !this.authenticatedServers[this.currentServer]) {
      return { success: false, message: this.translate('auth_required_filesystem') };
    }

    // Start from the root of the current server
    let current = this.root.servers[this.currentServer].root;

    // If we're at root, just return the content
    if (path === '/') {
      return {
        success: true,
        content: this.formatDirectoryContent(current),
      };
    }

    // Split the path and navigate to the current directory
    const segments = path.split('/').filter(segment => segment.length > 0);
    
    for (const segment of segments) {
      if (current[segment]) {
        current = current[segment];
      } else {
        return {
          success: false,
          message: `${this.translate('directory_not_found')} ${segment}`,
        };
      }
    }

    // Check if the destination is a directory
    if (typeof current !== 'object') {
      return {
        success: false,
        message: `${this.translate('not_a_directory')} ${path}`,
      };
    }

    return {
      success: true,
      content: this.formatDirectoryContent(current),
    };
  }

  // Format directory content for display
  formatDirectoryContent(directory) {
    const dirs = [];
    const files = [];

    for (const [name, content] of Object.entries(directory)) {
      if (typeof content === 'object') {
        dirs.push(name);
      } else {
        files.push(name);
      }
    }

    return {
      directories: dirs.sort(),
      files: files.sort(),
    };
  }

  // Change directory
  changeDirectory(path) {
    if (!this.currentServer) {
      return { success: false, message: this.translate('not_connected_filesystem') };
    }

    // Check if server is protected and we're not authenticated
    if (this.root.servers[this.currentServer].protected && 
        !this.authenticatedServers[this.currentServer]) {
      return { success: false, message: this.translate('auth_required_filesystem') };
    }

    // Resolve the path
    const resolved = this.resolvePath(path);
    if (!resolved.success) {
      return resolved;
    }

    const resolvedPath = resolved.path;

    // Start from the root of the current server
    let current = this.root.servers[this.currentServer].root;

    // If we're going to root, just update the path
    if (resolvedPath === '/') {
      this.currentPath = '/';
      return { success: true, path: this.currentPath };
    }

    // Split the path and navigate to the target directory
    const segments = resolvedPath.split('/').filter(segment => segment.length > 0);
    
    for (const segment of segments) {
      if (current[segment]) {
        if (typeof current[segment] === 'object') {
          current = current[segment];
        } else {
          return {
            success: false,
            message: `${this.translate('not_a_directory')} ${segment}`,
          };
        }
      } else {
        return {
          success: false,
          message: `${this.translate('directory_not_found')} ${segment}`,
        };
      }
    }

    // Update current path and return success
    this.currentPath = resolvedPath;
    return { success: true, path: this.currentPath };
  }

  // Get file content
  getFileContent(filePath) {
    if (!this.currentServer) {
      return { success: false, message: this.translate('not_connected_filesystem') };
    }

    // Check if server is protected and we're not authenticated
    if (this.root.servers[this.currentServer].protected && 
        !this.authenticatedServers[this.currentServer]) {
      return { success: false, message: this.translate('auth_required_filesystem') };
    }

    let path, fileName;

    // If filePath contains a path, resolve it
    if (filePath.includes('/')) {
      const lastSlashIndex = filePath.lastIndexOf('/');
      path = filePath.substring(0, lastSlashIndex);
      fileName = filePath.substring(lastSlashIndex + 1);
      
      // Temporarily change directory to get the file
      const currentPathBackup = this.currentPath;
      const cdResult = this.changeDirectory(path);
      
      if (!cdResult.success) {
        return cdResult;
      }
      
      const result = this.getFileContent(fileName);
      
      // Restore original path
      this.currentPath = currentPathBackup;
      return result;
    } else {
      // We're looking for a file in the current directory
      fileName = filePath;
    }

    // Start from the root of the current server
    let current = this.root.servers[this.currentServer].root;

    // Navigate to the current directory
    if (this.currentPath !== '/') {
      const segments = this.currentPath.split('/').filter(segment => segment.length > 0);
      
      for (const segment of segments) {
        if (current[segment]) {
          current = current[segment];
        } else {
          return {
            success: false,
            message: `${this.translate('directory_not_found')} ${segment}`,
          };
        }
      }
    }

    // Check if the file exists
    if (current[fileName]) {
      if (typeof current[fileName] === 'string') {
        let content = current[fileName];
        
        // Check if content is a translation key
        if (translations.en[content]) {
          content = this.translate(content);
        }
        
        const fileType = this.getFileType(content);
        
        // analytics track
        analytics.trackFileOpen(fileName, fileType, this.currentServer);
        
        return {
          success: true,
          content: content,
          type: fileType,
        };
      } else {
        return {
          success: false,
          message: `${this.translate('not_a_file')} ${fileName}`,
        };
      }
    } else {
      return {
        success: false,
        message: `${this.translate('file_not_found')}: ${fileName}`,
      };
    }
  }

  // Get file type based on its content
  getFileType(content) {
    if (content.startsWith('pdf:')) {
      return 'pdf';
    } else if (content.startsWith('image:')) {
      return 'image';
    } else if (content.startsWith('timeline:')) {
      return 'timeline';
    } else if (content.trim().startsWith('http://') || content.trim().startsWith('https://')) {
      return 'url'; // Новый тип для URL
    } else {
      return 'text';
    }
  }

  // Get server details
  getServerDetails() {
    if (!this.currentServer) {
      return null;
    }
    
    return {
      name: this.root.servers[this.currentServer].name,
      ip: this.currentServer,
      background: this.root.servers[this.currentServer].background,
    };
  }

  // Disconnect from server
  disconnect() {
    this.authenticatedServers = {};

    this.currentServer = null;
    this.currentPath = '/';

    return { success: true };
  }

  // Get list of available servers
  getAvailableServers() {
    return Object.keys(this.root.servers).map(ip => ({
      ip,
      name: this.root.servers[ip].name,
    }));
  }

  // Auto-complete command
  autoComplete(command, arg) {
    if (!this.currentServer) {
      return { success: false, message: this.translate('not_connected_filesystem') };
    }

    // Check if server is protected and we're not authenticated
    if (this.root.servers[this.currentServer].protected && 
        !this.authenticatedServers[this.currentServer]) {
      return { success: false, message: this.translate('auth_required_filesystem') };
    }

    // Get current directory content
    const dirContent = this.getCurrentDirectoryContent();
    if (!dirContent.success) {
      return dirContent;
    }

    const { directories, files } = dirContent.content;
    
    // For cd command, we only care about directories
    if (command === 'cd') {
      const matchingDirs = directories.filter(dir => dir.startsWith(arg));
      return {
        success: true,
        matches: matchingDirs,
      };
    }
    
    // For cat and run commands, we only care about files
    if (command === 'cat' || command === 'run') {
      const matchingFiles = files.filter(file => file.startsWith(arg));
      return {
        success: true,
        matches: matchingFiles,
      };
    }
    
    return {
      success: false,
      message: 'Auto-completion not supported for this command',
    };
  }
}

const fileSystem = new FileSystem();
export default fileSystem;