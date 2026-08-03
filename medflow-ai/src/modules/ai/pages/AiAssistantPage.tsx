import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { PageHeader } from '../../../shared/components/PageHeader/PageHeader';
import { Card, CardBody } from '../../../shared/components/Card/Card';
import { Input } from '../../../shared/components/Input/Input';
import { Button } from '../../../shared/components/Button/Button';
import { Alert } from '../../../shared/components/Alert/Alert';
import { EmptyState } from '../../../shared/components/EmptyState/EmptyState';
import { assistantApi } from '../../../core/api/services';
import { ApiError } from '../../../core/api/client';
import { formatTime } from '../../../core/utils/format';

interface Turn {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  at: string;
}

export default function AiAssistantPage() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;

    setDraft('');
    setError(null);
    setIsSending(true);
    const now = new Date().toISOString();
    setTurns((current) => [...current, { id: `local-${now}`, role: 'USER', content, at: now }]);

    try {
      const reply = await assistantApi.send(content, conversationId);
      setConversationId(reply.conversationId);
      setTurns((current) => [
        ...current,
        { id: String(reply.id), role: 'ASSISTANT', content: reply.content, at: reply.createdAt },
      ]);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'The assistant did not respond');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mf-space-5)' }}>
      <PageHeader
        title="AI Assistant"
        description="Ask about schedules, lab results and workflows. Replies are persisted per conversation."
      />

      {error && (
        <Alert tone="danger" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card padding="lg">
        <CardBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mf-space-4)', minHeight: 320 }}>
            {turns.length === 0 ? (
              <EmptyState
                icon={<Sparkles size={22} />}
                title="Start a conversation"
                description="Try “what's on the schedule today?” or “how do I record lab results?”"
              />
            ) : (
              turns.map((turn) => (
                <div
                  key={turn.id}
                  style={{
                    alignSelf: turn.role === 'USER' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    background:
                      turn.role === 'USER' ? 'var(--mf-accent-soft, #eef2ff)' : 'var(--mf-surface-2, #f6f7f9)',
                    borderRadius: 'var(--mf-radius-md, 12px)',
                    padding: 'var(--mf-space-3) var(--mf-space-4)',
                  }}
                >
                  <div style={{ fontSize: 12, color: 'var(--mf-text-muted)', marginBottom: 4 }}>
                    {turn.role === 'USER' ? 'You' : 'MedFlow assistant'} · {formatTime(turn.at)}
                  </div>
                  {turn.content}
                </div>
              ))
            )}
          </div>

          <form onSubmit={send} style={{ display: 'flex', gap: 'var(--mf-space-3)', marginTop: 'var(--mf-space-5)' }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="Ask the assistant…"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
            </div>
            <Button type="submit" isLoading={isSending} rightIcon={<Send size={15} />}>
              Send
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
