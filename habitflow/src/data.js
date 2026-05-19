export const INITIAL_HABITS = [
  { id: 1, name: 'Drink Water', category: 'Health', subcategory: 'Hydration', type: 'Count', target: 8, unit: 'glasses', current: 7, repeat: 'Daily', reminder: '12:00 PM', duration: '2 hours', activeWindow: '12:00 PM – 2:00 PM', icon: '💧', status: 'Active', percent: 88, notes: '' },
  { id: 2, name: 'Reading', category: 'Personal Growth', subcategory: '', type: 'Timer', target: 30, unit: 'min', current: 30, repeat: 'Daily', reminder: '8:45 AM', duration: '1 hour', activeWindow: '8:45 AM – 9:45 AM', icon: '📚', status: 'Completed', percent: 100, notes: '' },
  { id: 3, name: 'Workout', category: 'Health', subcategory: 'Fitness', type: 'Timer', target: 45, unit: 'min', current: 35, repeat: 'Daily', reminder: '7:15 AM', duration: '2 hours', activeWindow: '7:15 AM – 9:15 AM', icon: '🏋️', status: 'Active', percent: 78, notes: '' },
  { id: 4, name: 'Meditation', category: 'Mindfulness', subcategory: '', type: 'Timer', target: 10, unit: 'min', current: 10, repeat: 'Daily', reminder: '6:30 AM', duration: '30 min', activeWindow: '6:30 AM – 7:00 AM', icon: '🧘', status: 'Completed', percent: 100, notes: '' },
  { id: 5, name: 'Study', category: 'Learning', subcategory: '', type: 'Timer', target: 60, unit: 'min', current: 45, repeat: 'Daily', reminder: '2:00 PM', duration: '2 hours', activeWindow: '2:00 PM – 4:00 PM', icon: '🎓', status: 'Upcoming', percent: 75, notes: '' },
  { id: 6, name: 'Sleep', category: 'Health', subcategory: 'Rest', type: 'Custom', target: 8, unit: 'hours', current: 7.5, repeat: 'Daily', reminder: '10:30 PM', duration: '8 hours', activeWindow: '10:30 PM – 6:30 AM', icon: '🌙', status: 'Active', percent: 94, notes: '' },
]

export const INITIAL_GOALS = [
  { id: 1, name: 'Read 12 Books', category: 'Learning', type: 'Count', target: 12, current: 8, unit: 'books', startDate: 'Jan 1, 2024', deadline: 'Jul 31, 2024', reminder: '8:00 PM', status: 'Active', icon: '📚', milestones: [25, 50, 75, 100], reached: [25, 50], notes: '' },
  { id: 2, name: 'Workout 60 Times', category: 'Fitness', type: 'Count', target: 60, current: 27, unit: 'workouts', startDate: 'Jan 1, 2024', deadline: 'Jun 30, 2024', reminder: '7:00 AM', status: 'Active', icon: '🏋️', milestones: [25, 50, 75, 100], reached: [25], notes: '' },
  { id: 3, name: 'Save $5,000', category: 'Finance', type: 'Amount', target: 5000, current: 1900, unit: 'USD', startDate: 'Jan 1, 2024', deadline: 'Dec 31, 2024', reminder: '9:00 AM', status: 'At Risk', icon: '💵', milestones: [25, 50, 75, 100], reached: [], notes: '' },
  { id: 4, name: 'Meditate 100 Sessions', category: 'Mindfulness', type: 'Count', target: 100, current: 100, unit: 'sessions', startDate: 'Jan 1, 2024', deadline: 'May 10, 2024', reminder: '6:30 AM', status: 'Completed', icon: '🧘', milestones: [25, 50, 75, 100], reached: [25, 50, 75, 100], notes: '' },
  { id: 5, name: 'Launch Portfolio', category: 'Productivity', type: 'Yes/No', target: 1, current: 0, unit: 'project', startDate: 'Jun 15, 2024', deadline: 'Dec 31, 2024', reminder: '10:00 AM', status: 'Upcoming', icon: '🧳', milestones: [25, 50, 75, 100], reached: [], notes: '' },
  { id: 6, name: 'Sleep Before 11 PM 20 Days', category: 'Health', type: 'Count', target: 20, current: 14, unit: 'days', startDate: 'May 1, 2024', deadline: 'May 31, 2024', reminder: '10:00 PM', status: 'Active', icon: '🌙', milestones: [25, 50, 75, 100], reached: [25, 50], notes: '' },
]

export const INITIAL_NOTES = [
  { id: 1, title: 'Daily Reflection', category: 'Daily', tags: ['Reflection', 'Gratitude'], content: 'Grateful for a productive day. Focused deeply, stayed consistent with habits, and made progress on my goals. Tomorrow I will continue building momentum.', pinned: true, createdAt: 'Today, 10:25 AM', updatedAt: '2 min ago' },
  { id: 2, title: 'Workout Plan', category: 'Health', tags: ['Fitness', 'Plan'], content: 'My workout routine focuses on building strength, improving mobility, and staying consistent. The plan is built around compound movements, progressive overload, and adequate recovery.\n\nI train 4 times per week with the following split:\n- Day 1 – Push (Chest, Shoulders, Triceps)\n- Day 2 – Pull (Back, Biceps)\n- Day 3 – Legs\n- Day 4 – Full Body / Conditioning', pinned: true, createdAt: 'May 3, 2024', updatedAt: '2 min ago' },
  { id: 3, title: 'Video Ideas', category: 'Ideas', tags: ['Ideas', 'Content', 'YouTube'], content: 'Documentary style about building habits. Include interviews, visual progress, and small improvements compound over time...', pinned: false, createdAt: 'Yesterday, 6:45 PM', updatedAt: '1 day ago' },
  { id: 4, title: 'Reading Notes', category: 'Study', tags: ['Study', 'Books', 'Notes'], content: 'Atomic Habits – Key takeaway: systems over goals. Small improvements compound over time...', pinned: false, createdAt: 'May 2, 2024', updatedAt: '3 days ago' },
  { id: 5, title: 'Goal Breakdown', category: 'Goals', tags: ['Goals', 'Planning', 'Strategy'], content: 'Break down big goals into monthly and weekly milestones. Track progress and adjust...', pinned: false, createdAt: 'May 1, 2024', updatedAt: '4 days ago' },
  { id: 6, title: 'Quick Thoughts', category: 'Daily', tags: ['Random', 'Thoughts'], content: 'Random thoughts, ideas, and reminders that come to mind throughout the day.', pinned: false, createdAt: 'Apr 30, 2024', updatedAt: '5 days ago' },
]

export const INITIAL_SETTINGS = {
  appearance: 'Light',
  theme: 'default',
  language: 'English',
  timeFormat: '12-hour (AM/PM)',
  firstDay: 'Monday',
  compactMode: false,
  habitReminders: true,
  goalReminders: true,
  dailySummary: true,
  focusTimerAlerts: true,
  soundEffects: false,
  doNotDisturb: false,
  dndStart: '10:00 PM',
  dndEnd: '7:00 AM',
  focusLength: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  autoStart: true,
  ambientSound: 'Lo-fi Beats',
  showCompletedDays: true,
  defaultView: 'Week View',
  autoSaveNotes: true,
  richText: true,
  syncData: true,
  backupFrequency: 'Weekly',
  weekendTracking: true,
  defaultReminderTime: '12:00 PM',
  defaultDuration: '30 minutes',
  autoComplete: 'Ask to confirm',
  missedHabit: 'Mark as missed',
}

export const NOTIFICATIONS = [
  { id: 1, icon: '🔥', title: '12 Day Streak!', sub: 'Keep going, you\'re on fire!' },
  { id: 2, icon: '✅', title: 'Meditation complete', sub: '10 min – Just now' },
  { id: 3, icon: '⏰', title: 'Study reminder', sub: 'Starts in 30 minutes' },
]
