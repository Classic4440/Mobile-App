// Animation Settings Hook - Provides animation configuration based on user preferences

import { useMemo } from 'react';
import { useApp, ANIMATION_DURATIONS } from '../contexts/AppContext';

export function useAnimationSettings() {
  const { uiSettings, animationDuration } = useApp();
  
  const animationConfig = useMemo(() => {
    const duration = uiSettings.reduceMotion ? 0 : (ANIMATION_DURATIONS[uiSettings.animationSpeed] || 250);
    
    return {
      // Duration in milliseconds
      duration,
      // Whether animations are enabled
      enabled: uiSettings.showAnimations && !uiSettings.reduceMotion,
      // Whether haptic feedback is enabled
      hapticsEnabled: uiSettings.enableHaptics,
      // Reduce motion preference
      reduceMotion: uiSettings.reduceMotion,
      // The current animation speed setting
      speed: uiSettings.animationSpeed,
    };
  }, [uiSettings.showAnimations, uiSettings.enableHaptics, uiSettings.reduceMotion, uiSettings.animationSpeed, animationDuration]);
  
  return animationConfig;
}

export default useAnimationSettings;
