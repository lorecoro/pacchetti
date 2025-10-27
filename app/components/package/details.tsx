// app/components/package/details.tsx

'use client';

import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface Props {
  onClick: () => void;
}

export default function DetailsButton(props: Props) {
  const { onClick } = props;

  return (
    <button className="pl-4" onClick={onClick}>
      <InformationCircleIcon className="w-5" />
    </button>
  )
}