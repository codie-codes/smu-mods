import { useTutorial as useTutorialContext } from '@/components/tutorial/TutorialProvider';

export function useTutorial() {
  return useTutorialContext();
}
