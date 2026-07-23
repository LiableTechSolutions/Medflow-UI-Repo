import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Modal } from './Modal';

const meta = {
  title: 'MedFlow Design System/Components/Modal',
  component: Modal,
  args: {
    isOpen: true,
    title: 'Confirm action',
    description: 'This will send the care summary to the patient inbox.',
    size: 'md',
    children: <p>Are you sure you want to continue?</p>,
    footer: <Button variant="primary">Confirm</Button>,
  },
  render: (args) => <Modal {...args} onClose={() => undefined} />,
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => undefined,
    children: <p>Are you sure you want to continue?</p>,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    title: 'Discharge summary',
    onClose: () => undefined,
    children: <p>Review the discharge summary before sending.</p>,
  },
};
