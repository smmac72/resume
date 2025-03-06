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
              'readme.txt': `note to the future me - if you don't know what this server is, amnesia came. check the logins.txt if you're still making games. read my old dev notes and make me proud mate!\notherwise, if you aren't me but interested in my personal data, use the 'help' command - there's a custom terminal here. gl mate!\n\n- me`,
              'linkedin.sh': 'https://www.linkedin.com/in/oleg-bogomolov-035713335/',
              'hh.sh': 'https://hh.ru/resume/aede5f73ff0b7f9f570039ed1f6d6a6736696c'
            },
            etc: {
              'logins.txt': 'zeromac:naughtshad@31.31.196.2\nzeromac:allsspent@31.31.196.3\nzeromac:whereourdesire@31.31.196.4',
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
              'readme.txt': `a small compilation of my workplaces. timeline files contain the most important events and achievements. due to a little funny document, i won't be storing any sensitive documents here\nbut if you want to know what i did - you're welcome`,
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
              'github.sh': 'https://github.com/smmac72/zeroRender',
              'readme.txt': 'note to self - making game content is cool, but you know what is cooler? low-level programming. god i miss my risc-v days...\nanyways, a cool thing i did on my redbull-driven three-night bonanza. code is acceptable by my standards',
            },
            chernograd: {
              'steam.sh': 'https://store.steampowered.com/app/3047300/CHERNOGRAD/',
              'readme.txt': 'a small piece of our kgb-simulator indie game. pretty hard to finish rn, but i had finally returned to the developer me, not gamedesigner me\nit is broken, but i will get to chernograd when my happiness is back',
              'demomemory.png': 'image:demomemory.jpg',
              'firststreamer.png': 'image:firststreamer.jpg',
              'deck.png': 'image:deck.jpg',
              'rei.png': 'image:rei.jpg',
              'release.png': 'image:release.jpg',
              'techdocs.png': 'image:techdocs.jpg',
              'localization.png': 'image:localization.jpg',
            },
            tabletop: {
              'readme.txt': 'got ourselves a publisher. just decided not to. i kinda understand the tabletops, but cannot get to like it\ni guess just not my thing, but it was certainly cool to try',
              'pitch.pptx': 'https://docs.google.com/presentation/d/1J4tuk1PBqaa_iccFenoiTlEkYEqwNX_MLkmcNfFSGdY/edit#slide=id.g2a8926ffb75_0_180',
              'rules.docx': 'https://docs.google.com/document/d/19DbA54xCZQKHBdRlbtjiAGJOyVrb8hMoPSZ3KZ85fto/edit?tab=t.0',
              'pnp.pdf': 'https://docs.google.com/presentation/d/19v1cJ2s1ihUtJwkHXWO1YGk-gcp6o7jutL2dYMVd7Z8/edit#slide=id.g28e64aa2097_0_206',
              'printedgame.png': 'image:tabletop.jpg',
            },
            web: {
              'github.sh': 'https://github.com/smmac72/resume',
              'sluchka.sh': 'https://sluchka.market',
              'readme.txt': 'this web-page is free like the wikipedia the free online encyclopedia that anyone from black mesa from edit!\nah no, the free online encyclopedia that no one will ever edit again!\ndid not understand the reference? check out half life vr, funny as hell\n\nanyways, i do not like web-dev, but have you seen a student with no prior experience getting a position without a cool resume? take a look at my first site, i made it in flask and will never share the sources, it was terrible.\n\nalso there is a sluchka.market website - a work in progress marketplace for the pet matching. it is a birthday gift for my best friend, as he wished for this project to come true, but big coporate men usually do not have time for their dreams :(\nso i made it for him. it can be down, cloud servers are expensive',
              'oldsite.sh': 'image:old_site.jpg',
            },
            gtao: {
              'balancedoc.xlsx': 'https://docs.google.com/spreadsheets/d/1oeNenv0Jt3pAe_Esq6SDZbESOZO94cTeWWO31des5Dw/edit?usp=sharing',
              'readme.txt': 'i most certainly believe i did a better job than rockstar. i mean, i did not, but i am not the richest gamedev company in the world\nalas, they did not hire me. but they did send my friends a cease and desist letter (we did a lot of gta modding in the past). i guess i was close to them in some way\n\noutdated as hell, will not try that again until i make roleplay games again',
            },
          },
          background: 'server3_bg.jpg',
        },
        '31.31.196.4': {
          name: 'Personal Server',
          username: 'zeromac',
          password: 'whereourdesire',
          protected: true, // This server requires authentication
          root: {
            personal: {
              'readme.txt': `hiya! my name's oleg, i am a full-time game designer (mobile f2p and mmorpg), even more full-time student. game design stuff is on the other servers, here's more about me. i am a:\n– programming guy at my core\n– cameraman and video editor since middle school\n– home trained half-professional cook with a decade of learning and experimenting\n– true shakespearean (new) english enjoyer - you did get the mcbeth reference from the server passwords, right? or you can accept it as a metal gear solid 2: sons of liberty reference\n– long airsoft enjoyer with my masada acr and lots of custom gear. alas, i gave my hobby away to grow as a professional\n\nactually, i am pretty cool! if you are not hiring, we can at least share the best sandwich in saint-p!`,
              'favgames.txt': `reminder to myself if there are no games i wish to play:\n1. drakenier - yoko taro is a genius at creating the perfect story and atmosphere\n2. metal gear - kojima is god! i hear it's amazing when the famous purple stuffed worm in flap-jaw space with the tuning fork does a raw blink on hara-kiri Rock. i need scissors! 61!\n3. yakuza - peak meme potential\n4. lisa (both the painful and the joyful) - truly a beautiful story that makes a man cry\n5. persona 5 (sorry i caught the hype wave) - BY THE MYRIAD TRUTHS\n6. call of duty: modern warfare 2 - if you thought of the new 2022 MW2, that's the wrong list\n7. stalker - the new one is a masterpiece. probably won't replay it, but peak story, cutscene directing, gameplay, atmosphere. truly the best experience of my 2024\n8. undertale - sans undertale. if you know, you know.\n9. max payne - the best third-person shooter in my absolutely objective opinion.\n10. grand theft auto series - i think it doesn't need any explanation. long-time fan, long-time modder, long-time taketwo opposition member`,
              'favmovies.txt': `movies/tv shows/producers - my top10:\n1. guy ritchie - who doesn't like a light-hearted criminal comedy?\n2. vince gilligan - i skipped my exams for the release of el camino. i regret nothing.\n3. hayao miyazaki - every work of his is a masterpiece\n4. the wachowski brothers? sisters? - probably the reason i managed to reinstall windows 18 years ago, when my parents left me home alone. seriously, matrix might be the force that made me a programmer\n5. luke besson - won't get political here with the leon inspiration. multipass.\n6. balabanov - every film made to amass budget for his strange true ideas was peak of the russian media. turned out i know the ethiopian guy in person lmao.\n7. quentin jerome tarantino - probably must be higher. also i wish to place miller's sin city here.\n8. limitless (i don't know other burger's movies) - must watch if not feeling alright. makes you believe you can go on\n9. the coen brothers - i even got myself the rug\n10. suits tv show - made me a better person. mike ross is quite relatable (except for the genius part)`,
              'favbooks.txt': `that would be a top5, i am not that memorable of the quotes:\n1. moby dick - "ignorance is the parent of fear"\n2. programming: principles and practice using c++ - "a computer is just a piece of hardware until someone — some programmer — writes code for it to do something useful"\n3. "when the power of imparting joy is equal to the will, the human soul requires no other heaven."\n4. alice's adventures in wonderland - "imagination is the only weapon in the war with reality"\n5. treasure island - "money can't buy happiness, but it can certainly buy a lot of other things"`,
              'utils.txt': `writing software:\n1. notion\n2. google docs\n3. coda\n\ncoding preferences:\n1. c/c++ - vs code or notepad++ with gcc\n2. python - idle only\n3. any web stuff (not flask) - vs code\n4. c++ with complex projects - vs2022\n\nbalancing:\n1. google spreadsheets. nothing else.\n\nprototyping:\n1. figma\n2. miro\n3. mspaint\n\ndb preferences:\n1. postgre - covers most of the relational databases\n2. mongodb json - for configs\n3. redis - for cached data`,
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
              'therearenoeastereggs.txt': 'go away. or watch the memes i hold on this server',
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
        '31.31.196.24': {
          name: 'Nothing',
          username: 'guest',
          password: 'guest',
          protected: false, // Public access
          root: {
            void: {
              'nothingimportant.txt': 'root:BYTHEMYRIADTRUTHS\n\nNo idea what these creds are for',
              'hiddenimage.png': 'image:meme8.jpg',
            },
          },
          background: 'server2_bg.jpg',
        },
        '31.31.196.69': {
          name: 'Absolute Top Secret Server',
          username: 'root',
          password: 'BYTHEMYRIADTRUTHS',
          protected: true, // Requires auth
          root: {
            secret: {
              'bruh.txt': `there're no cows here, just a fact - i own a child hospital in vorkuta. for meme purpose only\nor for my longwaited seat of the governor of vorkuta. alas, they found 6kg of drugs on him and gave him a pay raise, so i'm not going anywhere`,
              'vorkuta.png': 'image:vorkuta.jpg'
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
        if (ip === '31.31.196.69') {
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
        (!this.authenticatedServers[this.currentServer] || 
         !this.authenticatedServers[this.currentServer].authenticated)) {
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
