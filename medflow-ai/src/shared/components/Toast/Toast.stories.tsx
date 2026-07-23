import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { ToastProvider, useToast } from './Toast';

function ToastDemo() {
  const { show } = useToast();

  return (
    <Button variant="primary" onClick={() => show({ title: 'Appointment saved', description: 'The visit was successfully scheduled.', tone: 'success', duration: 3000 })}>
      Trigger toast
    </Button>
  );
}

const meta = {
  title: 'MedFlow Design System/Components/Toast',
  component: ToastProvider,
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: <ToastDemo /> },
};
