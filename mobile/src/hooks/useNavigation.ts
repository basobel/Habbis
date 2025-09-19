import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

/**
 * Centralny hook do nawigacji z hamburger menu
 * Zgodny z zasadami DRY i KISS
 */
export const useNavigation = () => {
  const dispatch = useDispatch();

  const handleNavigate = (screen: string) => {
    switch (screen) {
      case 'profile':
        router.push('/(tabs)/profile');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'premium':
        router.push('/premium');
        break;
      case 'achievements':
        router.push('/achievements');
        break;
      case 'statistics':
        router.push('/statistics');
        break;
      case 'help':
        router.push('/help');
        break;
      case 'about':
        router.push('/about');
        break;
      case 'logout':
        dispatch(logout() as any);
        break;
      default:
        console.warn(`Unknown navigation target: ${screen}`);
    }
  };

  return { handleNavigate };
};

export default useNavigation;
