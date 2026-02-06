# 🎯 TaskFlow - Your Productivity Companion

A beautiful Chrome extension that combines task management with activity suggestions to help you stay productive and take meaningful breaks.

## ✨ Features

### 📝 Task Management
- **Add & Manage Tasks**: Create, complete, and delete tasks with a clean interface
- **Smart Filtering**: View all tasks, only active tasks, or completed tasks
- **Sample Tasks**: Load sample tasks from JSONPlaceholder API for testing
- **Persistent Storage**: All tasks are saved locally in Chrome storage
- **Beautiful UI**: Modern gradient design with smooth animations

### 🎲 Activity Suggestions (Bored API)
- **Random Activities**: Get suggestions for activities when you need a break
- **Smart Filtering**: Filter by activity type and number of participants
- **Activity Details**: See accessibility and price levels for each activity
- **Activity History**: Keep track of your last 10 activities
- **Direct Links**: Some activities include helpful links

### 📊 Statistics Dashboard
- **Task Statistics**: View total, completed, and active tasks
- **Activity Counter**: Track how many activities you've tried
- **Completion Rate**: Visual progress bar showing your task completion percentage
- **Color-Coded Progress**: Green for high completion, orange for medium, purple for getting started

## 🚀 Installation

### Method 1: Load Unpacked Extension (Development)

1. **Download or Clone** this repository to your local machine

2. **Open Chrome Extensions Page**:
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or click Menu (⋮) → More Tools → Extensions

3. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**:
   - Click "Load unpacked"
   - Navigate to the `taskflow-extension` folder
   - Click "Select Folder"

5. **Done!** The TaskFlow icon should appear in your Chrome toolbar

### Method 2: Pin to Toolbar (Recommended)

After installation:
- Click the Extensions icon (puzzle piece) in Chrome toolbar
- Find "TaskFlow - Productivity Companion"
- Click the pin icon to keep it visible

## 📖 How to Use

### Task Management

1. **Add a Task**:
   - Click the extension icon
   - Go to the "Tasks" tab (default)
   - Type your task in the input field
   - Click "Add Task" or press Enter

2. **Complete a Task**:
   - Click the checkbox next to any task
   - Completed tasks will be shown with strikethrough

3. **Delete a Task**:
   - Click the red "×" button on any task

4. **Filter Tasks**:
   - Use the "All", "Active", or "Completed" buttons to filter your view

5. **Load Sample Tasks**:
   - Click "Load Sample Tasks" to get 5 sample tasks from JSONPlaceholder API
   - Great for testing the interface

### Taking Breaks

1. **Get Activity Suggestions**:
   - Click the "Take a Break" tab
   - Optionally select activity type (education, recreational, social, etc.)
   - Optionally select number of participants
   - Click "Get Activity Suggestion"

2. **View Activity Details**:
   - See the activity description
   - Check accessibility level (how easy it is to do)
   - Check price level (how expensive it is)
   - Click the link if available for more information

3. **Activity History**:
   - Scroll down to see your recent activities
   - Keep track of what you've tried

### View Statistics

1. **Check Your Stats**:
   - Click the "Stats" tab
   - View your task completion metrics
   - See how many activities you've explored

2. **Reset Data**:
   - Click "Clear All Data" to start fresh
   - **Warning**: This cannot be undone!

## 🔌 APIs Used

### JSONPlaceholder API
- **Endpoint**: `https://jsonplaceholder.typicode.com/todos`
- **Usage**: Provides sample tasks for demonstration
- **Free**: No API key required
- **Rate Limit**: No strict limits

### Bored API
- **Endpoint**: `https://www.boredapi.com/api/activity`
- **Usage**: Suggests random activities with various filters
- **Free**: No API key required
- **Filters**: Type, participants, price, accessibility

## 🎨 Design Features

- **Modern Gradient UI**: Purple to violet gradient theme
- **Smooth Animations**: Fade-ins, slides, and hover effects
- **Responsive Design**: Works perfectly in the extension popup (420px width)
- **Custom Scrollbars**: Styled scrollbars for better aesthetics
- **Empty States**: Helpful messages when no data is available
- **Toast Notifications**: Non-intrusive feedback messages

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Structure and markup
- **CSS3**: Modern styling with flexbox, grid, and animations
- **JavaScript (ES6+)**: Core functionality and API integration
- **Chrome Extension API**: Storage and extension features
- **Manifest V3**: Latest Chrome extension standard

### File Structure
```
taskflow-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Main UI structure
├── popup.js              # Core functionality
├── styles.css            # All styling
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # This file
```

### Storage
- Uses Chrome's `chrome.storage.local` API
- Stores tasks and activity history
- Data persists across browser sessions
- Automatic save on every change

### Permissions
- **storage**: For saving tasks and activity history
- **host_permissions**: For accessing JSONPlaceholder and Bored API

## 🎯 Use Cases

1. **Productivity Tracking**: Manage your daily tasks and to-dos
2. **Break Reminders**: Get activity suggestions when you need a mental break
3. **Work-Life Balance**: Track completion rates and ensure you're taking breaks
4. **Team Building**: Use social activities for team bonding ideas
5. **Personal Development**: Try educational and DIY activities

## 🔒 Privacy

- **No Data Collection**: All data stays local in your browser
- **No Analytics**: We don't track your usage
- **No External Accounts**: No sign-up or login required
- **Open Source**: Code is transparent and auditable

## 🐛 Troubleshooting

### Extension Won't Load
- Make sure you selected the correct folder containing `manifest.json`
- Check that Developer Mode is enabled
- Try disabling and re-enabling the extension

### Tasks Not Saving
- Check if Chrome has storage permissions
- Try clearing extension data and restarting

### API Calls Failing
- Check your internet connection
- Make sure host permissions are granted
- APIs might be temporarily down (rare)

## 🚧 Future Enhancements

- [ ] Task categories and tags
- [ ] Due dates and reminders
- [ ] Export tasks to CSV
- [ ] Dark mode toggle
- [ ] Customizable themes
- [ ] Sync across devices
- [ ] More API integrations
- [ ] Productivity analytics
- [ ] Custom activity lists

## 📝 License

MIT License - Feel free to use and modify as needed!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 💡 Credits

- **JSONPlaceholder**: Free fake REST API by [typicode](https://github.com/typicode)
- **Bored API**: Fun activity suggestions API
- **Design**: Inspired by modern productivity apps
- **Icons**: Custom gradient design with checkmark

## 📧 Support

For issues or questions, please open an issue in the repository.

---

**Made with ❤️ for productivity and well-being**

Enjoy using TaskFlow! 🚀
