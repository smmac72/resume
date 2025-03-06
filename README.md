# Interactive Gamified Resume

This project creates an interactive gamified resume that simulates a Linux-style terminal interface. Users can navigate through a virtual file system containing information about skills, experience, projects, and more.

## Features

- **Linux-style Terminal Interface**: Use commands like `cd`, `ls`, `cat`, and custom commands to navigate and interact with the system.
- **Multiple Virtual Servers**: Connect to different servers, each with unique content and structure.
- **Authentication System**: Discover and use credentials to access different servers.
- **File Types**: Run different file types (text, images, PDFs, timelines) to view content in various formats.
- **Multilingual Support**: Switch between English and Russian language interfaces.
- **Interactive Keyboard**: Visual keyboard that tracks keypresses.
- **Achievement System**: Unlock achievements for discovering features and content.
- **Background Music**: Play music while exploring the resume.

## Available Commands

- `connect <ip>` - Connect to a server
- `disconnect` - Disconnect from the current server
- `ls` - List files and directories
- `cd <directory>` - Change directory
- `cat <file>` - Display file content
- `run <file>` - Execute file and open in ContentBox
- `scan` - Scan for available servers
- `lang <language>` - Change language (en, ru)
- `playmusic [stop]` - Play or stop background music
- `help` - Display help information

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Build for production:
   ```
   npm run build
   ```
