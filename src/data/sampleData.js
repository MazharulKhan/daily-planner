function isoDate(daysFromToday) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}

export function makeSampleTasks() {
  return [
    {
      id: 'sample-1',
      title: 'Review morning standup notes',
      completed: false,
      priority: 'High',
      category: 'Work',
      time: '09:00',
      dueDate: isoDate(0),
    },
    {
      id: 'sample-2',
      title: 'Draft dashboard spec outline',
      completed: false,
      priority: 'Medium',
      category: 'Work',
      time: '11:00',
      dueDate: isoDate(0),
    },
    {
      id: 'sample-3',
      title: '30 min walk after lunch',
      completed: true,
      priority: 'Low',
      category: 'Health',
      time: '13:30',
      dueDate: isoDate(0),
    },
    {
      id: 'sample-4',
      title: 'Read React docs: hooks',
      completed: false,
      priority: 'Medium',
      category: 'Learning',
      time: '15:00',
      dueDate: isoDate(0),
    },
    {
      id: 'sample-5',
      title: 'Plan weekend trip',
      completed: false,
      priority: 'Low',
      category: 'Personal',
      time: '18:00',
      dueDate: isoDate(0),
    },
    {
      id: 'sample-6',
      title: 'Submit expense report',
      completed: false,
      priority: 'High',
      category: 'Work',
      time: '10:00',
      dueDate: isoDate(2),
    },
    {
      id: 'sample-7',
      title: 'Dentist appointment',
      completed: false,
      priority: 'Medium',
      category: 'Health',
      time: '14:00',
      dueDate: isoDate(3),
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
