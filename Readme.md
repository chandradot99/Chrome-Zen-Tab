# 🌟 Productivity Dashboard - Chrome Extension

A beautiful, feature-rich Chrome extension that transforms your new tab into a productivity powerhouse. Keep track of important dates, manage tasks, take rich-text notes, and access quick links - all in one elegant interface.

![Extension Preview](./preview.png)

## ✨ Features

### 🕒 **Multi-Timezone Clock Widget**
- Display multiple world times simultaneously
- Beautiful clock faces with location names
- Perfect for remote teams and global communications

### 📅 **Smart Date Tracking**
- Track birthdays, anniversaries, and important dates
- **Age calculation** - Shows "Turning 26" for birthdays
- **Anniversary tracking** - Displays "5 years" for anniversaries
- **Progress indicators** for upcoming dates
- **Color-coded urgency** - Today, this week, or upcoming
- **Import/Export** CSV functionality for easy backup

### ✅ **Advanced Task Manager**
- Create and organize daily tasks
- **Priority system** with star indicators
- **Smart filtering** - All, Todo, Done views
- **Progress tracking** with completion statistics
- **Visual feedback** with completion animations
- Auto-save functionality

### 📝 **Rich Text Notes**
- **WYSIWYG editor** powered by React Quill
- Format text with bold, italic, headers, lists
- **Expandable interface** for longer writing sessions
- **Auto-save** as you type
- **Copy to clipboard** functionality
- **Character & word count** tracking

### 🔗 **Quick Links Dashboard**
- Customizable shortcuts to your favorite sites
- **Popular suggestions** - Google, Gmail, GitHub, YouTube, etc.
- **Clean grid layout** with icons
- **Add custom links** functionality

### 🎨 **Beautiful Design**
- **Glassmorphism UI** with backdrop blur effects
- **Dark theme** optimized for daily use
- **Smooth animations** and micro-interactions
- **Responsive layout** that adapts to different screen sizes
- **Accessibility focused** with proper contrast and keyboard navigation

## 🚀 Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store](#) (link coming soon)
2. Click "Add to Chrome"
3. Confirm the installation
4. Open a new tab to start using!

### Manual Installation (Development)
1. Clone this repository
```bash
git clone https://github.com/your-username/productivity-dashboard-extension.git
cd productivity-dashboard-extension
```

2. Install dependencies
```bash
npm install
```

3. Build the extension
```bash
npm run build
```

4. Load in Chrome
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the `build` folder

## 🎯 Quick Start Guide

### Adding Your First Date
1. Click the **"+ Add Date"** button in the dates widget
2. Enter the person's name and select date
3. Choose type: Birthday, Anniversary, or Important Date
4. Watch as the countdown and age calculation appear!

### Creating Tasks
1. Navigate to the **Tasks** tab
2. Click **"Add Task"** or press the plus button
3. Type your task and press Enter
4. Click the star to mark as priority
5. Check off completed tasks

### Taking Notes
1. Switch to the **Notes** tab
2. Use the rich text toolbar for formatting
3. **Bold**, *italic*, headers, and lists are supported
4. Notes auto-save as you type
5. Click expand for full-screen writing

### Managing Quick Links
1. Scroll to the **Quick Links** section
2. Click **"+ Add Link"** to add custom shortcuts
3. Use **"Popular"** for common sites
4. Organize your most-used websites

## 💾 Data Management

### Import/Export Dates
- **Export**: Download your dates as CSV for backup
- **Import**: Upload CSV files or paste data directly
- **Supported formats**: Name, Type, Date columns
- **Smart parsing**: Handles various date formats (MM/DD/YYYY, YYYY-MM-DD, etc.)

### Data Storage
- All data is stored locally in your browser
- **Privacy-focused**: No data sent to external servers
- **Auto-backup**: Export your data regularly for safety
- **Cross-device sync**: Use import/export to transfer between devices

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Quill** for rich text editing
- **Lucide React** for beautiful icons
- **Chrome Extension Manifest V3**
- **Local Storage** for data persistence

## 🎨 Design Philosophy

This extension follows modern design principles:
- **Minimalism**: Clean, uncluttered interface
- **Functionality**: Every feature serves a clear purpose
- **Accessibility**: High contrast, keyboard navigation, screen reader support
- **Performance**: Fast loading, smooth animations, efficient rendering
- **Consistency**: Unified design language throughout

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Follow the code style**
   - Use TypeScript for type safety
   - Follow the existing component structure
   - Add proper error handling
5. **Test thoroughly**
6. **Submit a pull request**

### Development Guidelines
- **Component Structure**: Keep components small and focused
- **State Management**: Use React hooks for local state
- **Styling**: Use Tailwind utility classes
- **Accessibility**: Include proper ARIA labels and keyboard support
- **Performance**: Optimize re-renders and bundle size

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Multi-timezone clock widget
- ✅ Smart date tracking with age calculation
- ✅ Advanced task manager with priorities
- ✅ Rich text notes editor
- ✅ Quick links dashboard
- ✅ Import/Export functionality
- ✅ Beautiful glassmorphism UI

### Upcoming Features
- 🔄 Cloud sync capabilities
- 🔄 Weather widget integration
- 🔄 Calendar view for dates
- 🔄 Task categories and tags
- 🔄 Themes and customization options
- 🔄 Keyboard shortcuts

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? We'd love to hear from you!

- **Bug Reports**: [Create an issue](https://github.com/your-username/productivity-dashboard-extension/issues)
- **Feature Requests**: [Start a discussion](https://github.com/your-username/productivity-dashboard-extension/discussions)
- **Questions**: Check our [FAQ](./FAQ.md) or create a discussion

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **React Quill** team for the excellent rich text editor
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set
- **Chrome Extensions team** for the excellent documentation
- **Open source community** for inspiration and feedback

## 🌟 Show Your Support

If you find this extension helpful:
- ⭐ **Star the repository**
- 📢 **Share with friends and colleagues**
- 🐛 **Report bugs and suggest features**
- 💝 **Contribute to the codebase**

---

**Made with ❤️ for productivity enthusiasts**

Transform your new tab into a productivity powerhouse! 🚀