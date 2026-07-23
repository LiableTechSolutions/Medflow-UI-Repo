import { Link } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import { Button } from '../../../shared/components/Button/Button';
import { VitalsLine } from '../../../shared/components/VitalsLine/VitalsLine';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="mf-404">
      <span className="mf-404__mark">
        <Activity size={22} />
      </span>
      <VitalsLine className="mf-404__vitals" />
      <h1>Flatline. This page doesn&apos;t exist.</h1>
      <p>The route you followed doesn&apos;t match anything in MedFlow AI.</p>
      <Link to="/">
        <Button leftIcon={<ArrowLeft size={15} />}>Back to safety</Button>
      </Link>
    </div>
  );
}
