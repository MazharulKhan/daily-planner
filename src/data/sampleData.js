function isoDate(daysFromToday) {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate() + daysFromToday).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function nowISO() {
  return new Date().toISOString();
}

export function makeSampleTasks() {
  const now = nowISO();
  return [
    {
      id: 'sample-1',
      title: 'Review morning standup notes',
      completed: false,
      completedAt: null,
      priority: 'High',
      category: 'Work',
      time: '09:00',
      dueDate: null,
      updatedAt: now,
    },
    {
      id: 'sample-2',
      title: 'Draft dashboard spec outline',
      completed: false,
      completedAt: null,
      priority: 'Medium',
      category: 'Work',
      time: '11:00',
      dueDate: isoDate(0),
      updatedAt: now,
    },
    {
      id: 'sample-3',
      title: '30 min walk after lunch',
      completed: true,
      completedAt: now,
      priority: 'Low',
      category: 'Health',
      time: '13:30',
      dueDate: isoDate(0),
      updatedAt: now,
    },
    {
      id: 'sample-4',
      title: 'Read React docs: hooks',
      completed: false,
      completedAt: null,
      priority: 'Medium',
      category: 'Learning',
      time: '15:00',
      dueDate: isoDate(0),
      updatedAt: now,
    },
    {
      id: 'sample-5',
      title: 'Plan weekend trip',
      completed: false,
      completedAt: null,
      priority: 'Low',
      category: 'Personal',
      time: '18:00',
      dueDate: isoDate(0),
      updatedAt: now,
    },
    {
      id: 'sample-6',
      title: 'Submit expense report',
      completed: false,
      completedAt: null,
      priority: 'High',
      category: 'Work',
      time: '10:00',
      dueDate: isoDate(2),
      updatedAt: now,
    },
    {
      id: 'sample-7',
      title: 'Dentist appointment',
      completed: false,
      completedAt: null,
      priority: 'Medium',
      category: 'Health',
      time: '14:00',
      dueDate: isoDate(3),
      updatedAt: now,
    },
  ];
}

export function makeSampleIdeas() {
  const now = Date.now();
  return [
    {
      id: 'idea-1',
      text: 'Add a weekly review screen for tasks completed vs planned',
      createdAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'idea-2',
      text: 'Try keyboard shortcut to add a task from anywhere',
      createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
    },
    {
      id: 'idea-3',
      text: 'Group quick ideas by color tags later',
      createdAt: new Date(now - 1000 * 60 * 60 * 50).toISOString(),
    },
  ];
}
