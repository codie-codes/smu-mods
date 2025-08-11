import { TutorialStep } from '@/types/tutorial';

export const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to SMU MODs!',
    description: 'Let us show you around and help you make the most of our platform. This quick tutorial will guide you through all the key features.',
    media: {
      type: 'gif',
      src: '/timetable_video.gif',
      alt: 'Welcome to SMU MODs'
    },
    position: 'center'
  },
  {
    id: 'timetable',
    title: 'Build Your Timetable',
    description: 'Create and customize your semester timetable. Add modules, check for conflicts, and visualize your weekly schedule with our intuitive timetable builder.',
    media: {
      type: 'gif',
      src: '/timetable_video.gif',
      alt: 'Timetable feature demonstration'
    },
    targetElement: '[href*="/timetable"]',
    position: 'center'
  },
  {
    id: 'bid-analytics',
    title: 'Bid Price Analytics',
    description: 'Analyze historical bid prices to make informed decisions. View trends, compare modules, and strategize your bidding with comprehensive analytics.',
    media: {
      type: 'gif',
      src: '/bid_analytics_video.gif',
      alt: 'Bid analytics feature'
    },
    targetElement: '[href="/bid-analytics"]',
    position: 'center'
  },
  {
    id: 'planner',
    title: 'Academic Planner',
    description: 'Plan your entire academic journey. Track graduation requirements, plan future semesters, and ensure you meet all prerequisites.',
    media: {
      type: 'gif',
      src: '/planner_video.gif',
      alt: 'Academic planner feature'
    },
    targetElement: '[href="/planner"]',
    position: 'center'
  },
  {
    id: 'modules',
    title: 'Module Information',
    description: 'Browse detailed module information including descriptions, prerequisites, schedules, and reviews to make better module choices.',
    media: {
      type: 'gif',
      src: '/module_video.gif',
      alt: 'Module information feature'
    },
    targetElement: '[href="/modules"]',
    position: 'center'
  },
  {
    id: 'settings',
    title: 'Customize Your Experience',
    description: 'Personalize your settings including theme preferences, notification settings, and account information to suit your needs.',
    targetElement: '[href="/settings"]',
    position: 'center'
  }
];
