// State management
let tasks = [];
let activityHistory = [];
let currentFilter = 'all';

// API URLs
const JSONPLACEHOLDER_API = 'https://jsonplaceholder.typicode.com';
const BORED_API = 'https://www.boredapi.com/api/activity';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  setupEventListeners();
  renderTasks();
  updateStats();
});

// Load data from Chrome storage
async function loadData() {
  try {
    const result = await chrome.storage.local.get(['tasks', 'activityHistory']);
    tasks = result.tasks || [];
    activityHistory = result.activityHistory || [];
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Save data to Chrome storage
async function saveData() {
  try {
    await chrome.storage.local.set({ 
      tasks: tasks,
      activityHistory: activityHistory 
    });
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Task management
  document.getElementById('add-task-btn').addEventListener('click', addTask);
  document.getElementById('task-title').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  document.getElementById('load-sample-tasks').addEventListener('click', loadSampleTasks);

  // Task filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTasks();
    });
  });

  // Activity management
  document.getElementById('get-activity-btn').addEventListener('click', getActivity);

  // Stats
  document.getElementById('reset-stats').addEventListener('click', resetStats);
}

// Tab switching
function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `${tabName}-content`);
  });

  // Update stats when switching to stats tab
  if (tabName === 'stats') {
    updateStats();
  }

  // Render activity history when switching to bored tab
  if (tabName === 'bored') {
    renderActivityHistory();
  }
}

// Task Management Functions
function addTask() {
  const input = document.getElementById('task-title');
  const title = input.value.trim();

  if (!title) return;

  const task = {
    id: Date.now(),
    title: title,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(task);
  input.value = '';
  saveData();
  renderTasks();
  updateStats();
  
  // Show success animation
  showNotification('Task added successfully!');
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveData();
    renderTasks();
    updateStats();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveData();
  renderTasks();
  updateStats();
  showNotification('Task deleted');
}

function renderTasks() {
  const tasksList = document.getElementById('tasks-list');
  
  // Filter tasks
  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  }

  if (filteredTasks.length === 0) {
    tasksList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <div class="empty-state-text">
          ${currentFilter === 'all' ? 'No tasks yet. Add one to get started!' : 
            currentFilter === 'completed' ? 'No completed tasks yet.' : 
            'No active tasks. Great job!'}
        </div>
      </div>
    `;
    return;
  }

  tasksList.innerHTML = filteredTasks.map(task => `
    <div class="task-item ${task.completed ? 'completed' : ''}">
      <input 
        type="checkbox" 
        class="task-checkbox" 
        ${task.completed ? 'checked' : ''}
        onchange="toggleTask(${task.id})"
      />
      <span class="task-text">${escapeHtml(task.title)}</span>
      <button class="task-delete" onclick="deleteTask(${task.id})">×</button>
    </div>
  `).join('');
}

async function loadSampleTasks() {
  try {
    showNotification('Loading sample tasks...');
    
    const response = await fetch(`${JSONPLACEHOLDER_API}/todos?_limit=5`);
    const todos = await response.json();

    todos.forEach(todo => {
      tasks.unshift({
        id: Date.now() + Math.random(),
        title: todo.title,
        completed: todo.completed,
        createdAt: new Date().toISOString()
      });
    });

    saveData();
    renderTasks();
    updateStats();
    showNotification('Sample tasks loaded!');
  } catch (error) {
    console.error('Error loading sample tasks:', error);
    showNotification('Failed to load sample tasks', 'error');
  }
}

// Activity Management Functions
async function getActivity() {
  const btn = document.getElementById('get-activity-btn');
  const activityCard = document.getElementById('activity-card');
  
  btn.disabled = true;
  btn.textContent = '🔄 Finding activity...';

  try {
    const type = document.getElementById('activity-type').value;
    const participants = document.getElementById('activity-participants').value;

    let url = BORED_API;
    const params = new URLSearchParams();
    
    if (type) params.append('type', type);
    if (participants) params.append('participants', participants);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }

    const response = await fetch(url);
    const activity = await response.json();

    if (activity.error) {
      showNotification('No activities found with those criteria', 'error');
      activityCard.classList.add('hidden');
    } else {
      displayActivity(activity);
      
      // Add to history
      activityHistory.unshift({
        ...activity,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 10
      if (activityHistory.length > 10) {
        activityHistory = activityHistory.slice(0, 10);
      }
      
      saveData();
      renderActivityHistory();
      updateStats();
    }
  } catch (error) {
    console.error('Error fetching activity:', error);
    showNotification('Failed to fetch activity', 'error');
    activityCard.classList.add('hidden');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '🎲 Get Activity Suggestion';
  }
}

function displayActivity(activity) {
  const card = document.getElementById('activity-card');
  
  // Show card
  card.classList.remove('hidden');

  // Update content
  card.querySelector('.activity-type').textContent = activity.type;
  card.querySelector('.activity-participants').textContent = 
    activity.participants === 1 ? '👤 Solo' : `👥 ${activity.participants} people`;
  
  card.querySelector('.activity-title').textContent = activity.activity;

  // Update progress bars
  const accessibilityBar = card.querySelector('[data-type="accessibility"]');
  const priceBar = card.querySelector('[data-type="price"]');
  
  accessibilityBar.style.width = `${activity.accessibility * 100}%`;
  priceBar.style.width = `${activity.price * 100}%`;

  // Update link if available
  const link = card.querySelector('.activity-link');
  if (activity.link) {
    link.href = activity.link;
    link.style.display = 'inline-block';
  } else {
    link.style.display = 'none';
  }

  // Animate card entrance
  card.style.animation = 'none';
  setTimeout(() => {
    card.style.animation = 'fadeIn 0.5s ease';
  }, 10);
}

function renderActivityHistory() {
  const historyList = document.getElementById('history-list');
  
  if (activityHistory.length === 0) {
    historyList.innerHTML = `
      <div class="empty-state-text" style="padding: 20px; text-align: center;">
        No activities yet. Try one above!
      </div>
    `;
    return;
  }

  historyList.innerHTML = activityHistory.map((activity, index) => `
    <div class="history-item">
      <strong>${activity.type}:</strong> ${escapeHtml(activity.activity)}
    </div>
  `).join('');
}

// Stats Functions
function updateStats() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = tasks.filter(t => !t.completed).length;
  const activitiesTried = activityHistory.length;

  document.getElementById('total-tasks').textContent = totalTasks;
  document.getElementById('completed-tasks').textContent = completedTasks;
  document.getElementById('active-tasks').textContent = activeTasks;
  document.getElementById('activities-tried').textContent = activitiesTried;

  // Completion rate
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const progressBar = document.getElementById('completion-progress');
  const completionText = document.getElementById('completion-text');
  
  progressBar.style.width = `${completionRate}%`;
  completionText.textContent = `${Math.round(completionRate)}% Complete`;
  
  // Color based on completion rate
  if (completionRate >= 75) {
    progressBar.style.background = 'linear-gradient(90deg, #28a745, #20c997)';
  } else if (completionRate >= 50) {
    progressBar.style.background = 'linear-gradient(90deg, #ffc107, #fd7e14)';
  } else {
    progressBar.style.background = 'linear-gradient(90deg, #667eea, #764ba2)';
  }
}

async function resetStats() {
  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
    tasks = [];
    activityHistory = [];
    await saveData();
    renderTasks();
    renderActivityHistory();
    updateStats();
    showNotification('All data cleared');
  }
}

// Utility Functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showNotification(message, type = 'success') {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'error' ? '#dc3545' : '#28a745'};
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideDown 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    to {
      transform: translateX(-50%) translateY(-100%);
      opacity: 0;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
document.head.appendChild(style);

// Make functions globally available
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
