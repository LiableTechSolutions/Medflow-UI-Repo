import { BarChart3, FileBarChart2, TrendingUp, Download } from 'lucide-react';
import { ModulePlaceholder } from '../../../shared/components/ModulePlaceholder/ModulePlaceholder';

export default function ReportsPage() {
  return (
    <ModulePlaceholder
      title="Reports & Analytics"
      features={[
        { icon: BarChart3, title: 'Operational Reports', description: 'Track patient flow, occupancy and staff utilization.' },
        { icon: TrendingUp, title: 'Trends', description: 'Spot patterns in admissions, revenue and outcomes over time.' },
        { icon: FileBarChart2, title: 'Custom Report Builder', description: 'Assemble a report from the metrics that matter to you.' },
        { icon: Download, title: 'Exports', description: 'Export any report as CSV or PDF for stakeholders.' },
      ]}
    />
  );
}
