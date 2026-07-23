import { UserPlus, FileText, CalendarCheck, Pill } from 'lucide-react';
import './ActivityTimeline.css';

const ACTIVITY = [
  { icon: UserPlus, tone: 'teal', title: 'New patient registered', meta: 'Meera Joshi · 8 min ago' },
  { icon: CalendarCheck, tone: 'green', title: 'Appointment confirmed', meta: 'Dr. Kabir Shah · 24 min ago' },
  { icon: Pill, tone: 'amber', title: 'Prescription updated', meta: 'Rohan Verma · 1 hr ago' },
  { icon: FileText, tone: 'coral', title: 'Lab report uploaded', meta: 'Priya Nair · 2 hr ago' },
] as const;

export function ActivityTimeline() {
  return (
    <ul className="mf-timeline">
      {ACTIVITY.map((item, idx) => {
        const Icon = item.icon;
        return (
          <li className="mf-timeline__item" key={idx}>
            <span className={`mf-timeline__icon mf-timeline__icon--${item.tone}`}>
              <Icon size={14} />
            </span>
            <div className="mf-timeline__text">
              <p className="mf-timeline__title">{item.title}</p>
              <p className="mf-timeline__meta">{item.meta}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
