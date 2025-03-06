// File System class to handle the virtual file structure

class FileSystem {
  constructor() {
    this.root = this.initializeFileSystem();
    this.currentPath = '/';
    this.currentServer = null;
    this.authenticatedServers = {}; // Track servers we've authenticated with
  }

  // Initialize the file system with sample data
  initializeFileSystem() {
    return {
      servers: {
        '31.31.196.1': {
          name: 'Backup Server',
          username: 'zeromac',
          password: 'zeromac',
          protected: false, // This server is accessible without auth
          root: {
            home: {
              'readme.txt': 'Welcome to my interactive resume terminal!\n\nUse commands like ls, cd, cat, run, scan to navigate and explore.\nThe SCAN command will help you discover additional servers.\n\nType "help" for a full list of commands.',
              'resume.sh': 'pdf:resume.pdf',
              'photo.sh': 'image:profile.jpg',
            },
            etc: {
              'logins.txt': 'zeromac:naughtshad@31.31.196.2\nzeromac:allsspent@31.31.196.3\nzeromac:whereourdesireisgotwithoutcontent@31.31.196.4',
              'servers.conf': 'Available servers on network:\n31.31.196.2 - Work Server\n31.31.196.3 - Pet Projects\n31.31.196.4 - Personal Server',
            },
          },
          background: 'server1_bg.jpg',
        },
        '31.31.196.2': {
          name: 'Work Server',
          username: 'zeromac',
          password: 'naughtshad',
          protected: true, // This server requires authentication
          root: {
            projects: {
              'globalcity.sh': 'timeline:globalcity',
              'nextrp.sh': 'timeline:nextrp',
              'samprp.sh': 'timeline:samprp',
              'readme.txt': 'This server contains information about my work projects and experiences.\nUse the "run" command on the .sh files to view detailed timelines.',
            },
          },
          background: 'server2_bg.jpg',
        },
        '31.31.196.3': {
          name: 'Pet Projects',
          username: 'zeromac',
          password: 'allsspent',
          protected: true, // This server requires authentication
          root: {
            renderer: {
              'renderer.sh': 'https://github.com/username/renderer',
              'readme.txt': 'A custom rendering engine project for real-time graphics applications.',
              'screenshot.sh': 'image:renderer_screenshot.jpg',
            },
            chernograd: {
              'chernograd.sh': 'https://github.com/username/chernograd',
              'readme.txt': 'A procedural city generation project for game environments.',
              'demo.sh': 'image:chernograd_demo.jpg',
            },
            tabletop: {
              'readme.txt': 'Collection of tabletop game tools and resources I\'ve created.',
              'vtt.sh': 'https://github.com/username/vtt-tool',
              'map-generator.sh': 'https://github.com/username/map-generator',
              'character-sheet.sh': 'https://github.com/username/character-sheet',
              'preview.sh': 'image:tabletop_preview.jpg',
            },
            web: {
              'portfolio.sh': 'https://username.github.io',
              'blog.sh': 'https://username.medium.com',
              'readme.txt': 'My web development projects and online presence.',
              'screenshot.sh': 'image:web_screenshot.jpg',
            },
            gtao: {
              'gtao.sh': 'https://github.com/username/gtao-tools',
              'readme.txt': 'Tools and scripts for GTA Online development.',
            },
          },
          background: 'server3_bg.jpg',
        },
        '31.31.196.4': {
          name: 'Personal Server',
          username: 'zeromac',
          password: 'whereourdesireisgotwithoutcontent',
          protected: true, // This server requires authentication
          root: {
            personal: {
              'about-me.txt': 'I am a passionate developer with interests in graphics programming, game development, and web technologies.\n\nI enjoy solving complex problems and creating immersive digital experiences.',
              'hobbies.txt': 'When not coding, I enjoy photography, playing chess, reading science fiction, and exploring new technologies.',
              'skills.txt': 'Programming Languages: C++, JavaScript, Python, C#\nFrameworks: React, Node.js, Unity\nTools: Git, Docker, VS Code\nSpecialties: Graphics Programming, Web Development, Game Development',
              'philosophy.txt': 'I believe in creating software that is not only functional but also intuitive and enjoyable to use. I value clean code, continuous learning, and collaborative development.',
              'goals.txt': 'My professional goals include developing innovative tools for creative industries, contributing to open-source projects, and mentoring aspiring developers.',
            },
          },
          background: 'server3_bg.jpg',
        },
        '31.31.196.10': {
          name: 'Meme Storage',
          username: 'guest',
          password: 'guest',
          protected: false, // Public access
          root: {
            memes: {
              'readme.txt': 'Welcome to my meme collection. Use at your own risk!',
              'meme1.sh': 'image:meme1.jpg',
              'meme2.sh': 'image:meme2.jpg',
              'meme3.sh': 'image:meme3.jpg',
              'meme4.sh': 'image:meme4.jpg',
              'meme5.sh': 'image:meme5.jpg',
              'meme6.sh': 'image:meme6.jpg',
              'meme7.sh': 'image:meme7.jpg',
              'meme8.sh': 'image:meme8.jpg',
              'meme9.sh': 'image:meme9.jpg',
              'meme10.sh': 'image:meme10.jpg',
              'meme11.sh': 'image:meme11.jpg',
              'meme12.sh': 'image:meme12.jpg',
              'cool-site.sh': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
          },
          background: 'server1_bg.jpg',
        },
        '31.31.196.24': {
          name: 'Nothing',
          username: 'guest',
          password: 'guest',
          protected: false, // Public access
          root: {
            void: {
              'secret.txt': 'The password you seek is: root:BYTHEMYRIADTRUTHS\n\nBut where could it lead?',
              'hint.sh': 'image:secret_hint.jpg',
            },
          },
          background: 'server2_bg.jpg',
        },
        '31.31.196.69': {
          name: 'Absolute Top Secret Server Which No One Can Ever Access',
          username: 'root',
          password: 'BYTHEMYRIADTRUTHS',
          protected: true, // Requires auth
          root: {
            secret: {
              'congratulations.txt': 'You found the most secret server!\n\nThis demonstrates your persistence and problem-solving skills.\n\nThank you for exploring my interactive resume in such detail!',
              'easter-egg.sh': 'image:easter_egg.jpg',
              'secret-project.sh': 'https://github.com/username/secret-project',
            },
          },
          background: 'server1_bg.jpg',
        },
      },
    };
  }

  // Connect to a server
  connectToServer(ip) {
    if (this.root.servers[ip]) {
      // Always reset to root path when connecting to a server
      this.currentServer = ip;
      this.currentPath = '/';
      
      // If the server is not protected or we're already authenticated, return it directly
      if (!this.root.servers[ip].protected || this.authenticatedServers[ip]) {
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
      message: 'Server not found',
    };
  }

  // Authenticate with a server
  authenticate(username, password) {
    if (!this.currentServer) {
      return {
        success: false,
        message: 'Not connected to any server',
      };
    }

    const server = this.root.servers[this.currentServer];
    if (server.username === username && server.password === password) {
      // Mark this server as authenticated
      this.authenticatedServers[this.currentServer] = true;
      
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
      message: 'Invalid credentials',
    };
  }

  // Resolve a path (handle ../, ./, etc.)
  resolvePath(path) {
    if (!this.currentServer) {
      return { success: false, message: 'Not connected to any server' };
    }

    // Check if server is protected and we're not authenticated
    if (this.root.servers[this.currentServer].protected && 
        !this.authenticatedServers[this.currentServer]) {
      return { success: false, message: 'Authentication required' };
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
      return { success: false, message: 'Not connected to any server' };
    }

    // Check if server is protected and we're not authenticated
    if (this.root.servers[this.currentServer].protected && 
        !this.authenticatedServers[this.currentServer]) {
      return { success: false, message: 'Authentication required' };
    }

    return this.getCurrentDirectoryContentForPath(this.currentPath);
  }
  
  // Get directory content for a specific path
  getCurrentDirectoryContentForPath(path) {
    if (!this.currentServer) {
      return { success: false, message: 'Not connected to any server' };
    }

    // Check if server is protected and we're not authenticated
    if (this.root.servers[this.currentServer].protected && 
        !this.authenticatedServers[this.currentServer]) {
      return { success: false, message: 'Authentication required' };
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
          message: `Directory not found: ${segment}`,
        };
      }
    }

    // Check if the destination is a directory
    if (typeof current !== 'object') {
      return {
        success: false,
        message: `Not a directory: ${path}`,
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
      return { success: false, message: 'Not connected to any server' };
    }

    // Check if server is protected and we're not authenticated
    if (this.root.servers[this.currentServer].protected && 
        !this.authenticatedServers[this.currentServer]) {
      return { success: false, message: 'Authentication required' };
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
            message: `Not a directory: ${segment}`,
          };
        }
      } else {
        return {
          success: false,
          message: `Directory not found: ${segment}`,
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
      return { success: false, message: 'Not connected to any server' };
    }

    // Check if server is protected and we're not authenticated
    if (this.root.servers[this.currentServer].protected && 
        !this.authenticatedServers[this.currentServer]) {
      return { success: false, message: 'Authentication required' };
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
            message: `Directory not found: ${segment}`,
          };
        }
      }
    }

    // Check if the file exists
    if (current[fileName]) {
      if (typeof current[fileName] === 'string') {
        return {
          success: true,
          content: current[fileName],
          type: this.getFileType(current[fileName]),
        };
      } else {
        return {
          success: false,
          message: `Not a file: ${fileName}`,
        };
      }
    } else {
      return {
        success: false,
        message: `File not found: ${fileName}`,
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
      return { success: false, message: 'Not connected to any server' };
    }

    // Check if server is protected and we're not authenticated
    if (this.root.servers[this.currentServer].protected && 
        !this.authenticatedServers[this.currentServer]) {
      return { success: false, message: 'Authentication required' };
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

export default new FileSystem();
