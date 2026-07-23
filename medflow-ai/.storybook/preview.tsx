import type { Decorator, Preview } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../src/app/providers/AppProviders';
import '../src/styles/global.css';

const withProviders: Decorator = (Story) => (
  <MemoryRouter initialEntries={['/']}>
    <AppProviders>
      <Story />
    </AppProviders>
  </MemoryRouter>
);

const preview: Preview = {
  decorators: [withProviders],
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'MedFlow Design System provides accessible, reusable React components for product teams.',
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F8FAFC' },
        { name: 'dark', value: '#0F172A' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;