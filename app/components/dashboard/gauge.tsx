// /app/components/dashboard/gauge.tsx

'use client';

import dynamic from "next/dynamic";

interface GaugeProps {
  value?: number;
};

export default function Gauge(props: GaugeProps) {
  const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });
  return (
    <div className="sm:pb-6 md:py-6 px-6 md:px-2">
      <GaugeComponent
        value={props.value ?? 0}
        type="radial"
        minValue={0}
        maxValue={240}
        arc={{
          colorArray: ['#EA4228','#5BE12C'],
          subArcs: [{limit: 10}, {limit: 30}, {}, {}, {}],
          padding: 0.02,
          width: 0.3
        }}
        pointer={{
          elastic: true,
          animationDelay: 0
        }}
        labels={{
          valueLabel: {
            style: {fontSize: 40, color: '#000', fontWeight: 'bold', textShadow: '0 0 5px #000, 0 0 10px #000'},
          },
          tickLabels: {
            type: 'outer',
            defaultTickValueConfig: {
              style: {fontSize: 18, color: '#000', fontWeight: 'bold'}
            }
          }
        }}
      />
    </div>
  )
}