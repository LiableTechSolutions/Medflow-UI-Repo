import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card, CardBody, CardFooter, CardHeader, CardSubtitle, CardTitle } from './Card';

const meta = {
  title: 'MedFlow Design System/Components/Card',
  component: Card,
  args: {
    padding: 'md',
    children: 'Card content',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Clinical intake</CardTitle>
        <CardSubtitle>Patient summary for today's appointment.</CardSubtitle>
      </CardHeader>
      <CardBody>
        <p>Vitals are stable and the follow-up plan has been documented.</p>
      </CardBody>
      <CardFooter>
        <Badge tone="green">Ready for review</Badge>
      </CardFooter>
    </Card>
  ),
};

export const Interactive: Story = {
  args: {
    interactive: true,
  },
  render: (args) => (
    <Card {...args} style={{ maxWidth: 360 }}>
      <CardHeader>
        <CardTitle>Lab review queue</CardTitle>
        <CardSubtitle>12 results awaiting sign-off</CardSubtitle>
      </CardHeader>
      <CardBody>
        <p>Escalate abnormal values before 5 PM for delivery hand-off.</p>
      </CardBody>
      <CardFooter>
        <Button variant="secondary">Review queue</Button>
      </CardFooter>
    </Card>
  ),
};
