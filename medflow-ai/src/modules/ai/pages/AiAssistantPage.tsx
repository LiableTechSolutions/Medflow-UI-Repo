import { Sparkles, MessageSquareText, FileSearch, Brain } from 'lucide-react';
import { ModulePlaceholder } from '../../../shared/components/ModulePlaceholder/ModulePlaceholder';

export default function AiAssistantPage() {
  return (
    <ModulePlaceholder
      title="AI Assistant"
      features={[
        { icon: MessageSquareText, title: 'Clinical Chat', description: 'Ask questions about a patient record in plain language.' },
        { icon: FileSearch, title: 'Summarization', description: 'Turn long visit notes into a short, readable summary.' },
        { icon: Brain, title: 'Insights', description: 'Surface patterns and risks the AI notices across records.' },
        { icon: Sparkles, title: 'Suggested Actions', description: 'Get suggested next steps based on the current case.' },
      ]}
    />
  );
}
