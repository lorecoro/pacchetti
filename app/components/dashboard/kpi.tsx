// app/components/dashboard/kpi.tsx

'use client';

interface KpiProps {
  label: string;
  percentage?: number;
  value?: number;
}

export default function Kpi(props: KpiProps) {
  const { label, percentage, value } = props;
  return (
    <div>
      <p className="text-xl lg:text-2xl text-center font-bold py-4 lg:py-8">{label.toUpperCase()}:</p>
      <p className="text-4xl lg:text-8xl text-center font-bold py-4 lg:py-8">{percentage}%</p>
      <p className="text-xl lg:text-3xl text-center font-bold py-4 lg:py-8">{value} min.</p>
    </div>
  );
}