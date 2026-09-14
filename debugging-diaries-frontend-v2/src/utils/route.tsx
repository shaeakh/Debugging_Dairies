import { ProtectedLayout, PublicLayout } from '@/components/Layout';
import EditStory from '@/pages/Story/EditStory';
import Auth from '@/pages/Auth';
import Home from '@/pages/Home';
import Landing from '@/pages/Landing';
import Profile from '@/pages/Profile';
import Search from '@/pages/Search';
import Settings from '@/pages/Settings';
import CreateStory from '@/pages/Story/CreateStory'; // ← নতুন
import StoryDetails from '@/pages/Story/StoryDetails';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
      {
        path: '/auth',
        element: <Auth />,
      },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/search',
        element: <Search />,
      },
      {
        path: '/profile/:username',
        element: <Profile />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      { path: '/story/create', element: <CreateStory /> },
      { path: '/story/edit/:id', element: <EditStory /> }, // ← নতুন
      { path: '/story/:storyid', element: <StoryDetails /> }, // ← নতুন
    ],
  },
  {
    path: '*',
    element: <div>404 - Page Not Found</div>,
  },
]);
