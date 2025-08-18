import { TutorialStep } from '@/types/tutorial';

export const tutorialSteps: TutorialStep[] = [
  {
    id: '1',
    title: 'First things First',
    description: "Begin by setting up your account. Choose your matriculation year, sync your data across devices with iSync, and give your module basket a quick refresh to make sure everything’s up to date. The beauty of SMUMODS is that we cache all your data locally on your browser, hence, why there's no need to sign in but an option to sync your data from time to time.",
    media: {
      type: 'gif',
      src: '/timetable_video.gif',
      alt: 'First things First'
    },
    position: 'center'
  },
  {
    id: '2',
    title: 'Build Your Timetable',
    description: 'Add your modules and explore the available sections. Click through to see details, check exam schedules, and use quick tips to understand professors and modules better. Watch as your personalized timetable comes to life.',
    media: {
      type: 'gif',
      src: '/timetable_video.gif',
      alt: 'Timetable feature demonstration'
    },
    targetElement: '[href*="/timetable"]',
    position: 'center'
  },
  {
    id: '3',
    title: 'Plan Your Bids with Confidence',
    description: 'Search for modules and view historic bid amounts for modules by professor, term, and section. Use our analytics and visualizations to spot trends and make smarter decisions before placing your bids.',
    media: {
      type: 'gif',
      src: '/bid_analytics_video.gif',
      alt: 'Bid analytics feature'
    },
    targetElement: '[href="/bid-analytics"]',
    position: 'center'
  },
  {
    id: '4',
    title: 'Map Out Your Study Journey',
    description: 'Create planners for different tracks or majors, then drag and drop modules into terms to explore possible paths. You’ll get helpful warnings if prerequisites aren’t met. Pro tip: you can share snapshots of your plans with friends, or sync them to your timetable.',
    media: {
      type: 'gif',
      src: '/planner_video.gif',
      alt: 'Academic planner feature'
    },
    targetElement: '[href="/planner"]',
    position: 'center'
  },
  {
    id: '5',
    title: 'Explore the Module Catalogue',
    description: 'Dive into our catalogue to discover module descriptions, and save your favorites for easy access later. It’s your one-stop shop for finding what fits your academic goals.',
    media: {
      type: 'gif',
      src: '/module_video.gif',
      alt: 'Module information feature'
    },
    targetElement: '[href="/modules"]',
    position: 'center'
  },
  {
    id: '6',
    title: 'Invitiation to join the SMUMODS Community',
    description: 'Love what we’re building (or think we could do better)? Be part of the open-source community! Head over to our GitHub to share feedback, contribute ideas, and help shape the future of SMUMODS together.',
    targetElement: '[href="/settings"]',
    position: 'center'
  }
];
