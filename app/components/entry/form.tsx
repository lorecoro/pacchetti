// app/components/entry/form.tsx

'use client';

import { Accordion, AccordionItem, DatePicker, Select, SelectItem } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { parseAbsoluteToLocal, getLocalTimeZone, now } from "@internationalized/date";
import ButtonWithSpinner from "@/app/components/common/button-with-spinner";
import type { PackageIdName } from "@/actions/package-list";
import type { Selection } from "@nextui-org/react";

interface Props {
  caption: string;
  icon: ReactNode;
  action: string | ((formData: FormData) => void | Promise<void>) | undefined;
  packages: PackageIdName[];
  theEntry?: {
    id: string;
    start: string;
    end: string;
    name: string;
    packageId: string;
  };
  errors?: {
    start?: string[];
    end?: string[];
    name?: string[];
    packageId?: string[];
    _form?: string[];
  }
}

type SelectArray = {
  key: string,
  label: string
}

export default function EntryForm(props: Props) {
  const { caption, icon, action, packages, theEntry, errors } = props;
  const t = useTranslations("ui");

  const packageSelect: SelectArray[] = packages.map((item) => {
    return {key: item.id, label: item.name}
  });
  const [selectedPackage, setSelectedPackage] = useState<Selection>(
    theEntry?.packageId ? new Set([theEntry.packageId]) : new Set([])
  );

  type accordionPropsType = {
    'aria-label': string;
    indicator?: ReactNode;
    title?: string;
    textValue?: string;
    variant?: 'splitted' | undefined;
  }
  const accordionProps: accordionPropsType = {
    'aria-label': caption,
  };
  if (icon) {
    accordionProps.indicator = icon;
    accordionProps.textValue = caption;
  }
  else {
    accordionProps.title = caption;
    accordionProps.textValue = caption;
    accordionProps.variant = 'splitted';
  }

  let defaultStart = now(getLocalTimeZone());
  if (theEntry?.start) {
    defaultStart = parseAbsoluteToLocal(theEntry.start);
  }
  let defaultEnd = now(getLocalTimeZone());
  if (theEntry?.end) {
    defaultEnd = parseAbsoluteToLocal(theEntry.end);
  }

  return (
    <Accordion>
      <AccordionItem key="1" {...accordionProps}>
        <form action={action}>
          {theEntry?.id && (
            <Input
              isReadOnly
              name="id"
              label="ID"
              labelPlacement="outside"
              defaultValue={theEntry?.id}
            />
          )}
          <DatePicker
            name="start"
            showMonthAndYearPickers
            defaultValue={defaultStart}
            label="Start"
            variant="bordered"
            isInvalid={!!errors?.start}
            errorMessage={errors?.start?.join(', ')}
          />
          <DatePicker
            name="end"
            showMonthAndYearPickers
            defaultValue={defaultEnd}
            label="End"
            variant="bordered"
            isInvalid={!!errors?.end}
            errorMessage={errors?.end?.join(', ')}
          />
          <Input
            name="name"
            label={t("name")}
            labelPlacement="outside"
            placeholder={t("name")}
            defaultValue={theEntry?.name}
            isInvalid={!!errors?.name}
            errorMessage={errors?.name?.join(', ')}
          />
          <Select
            name="packageId"
            items={packageSelect}
            label={t("package")}
            labelPlacement="outside"
            placeholder={t("package")}
            selectedKeys={selectedPackage}
            onSelectionChange={setSelectedPackage}
            isInvalid={!!errors?.packageId}
            errorMessage={errors?.packageId?.join(', ')}
          >
            {(item) => <SelectItem key={item.key} textValue={item.label}>{item.label}</SelectItem>}
          </Select>

          {errors?._form ? <div className="text-red">{errors?._form.join(', ')}</div> : null}

          <ButtonWithSpinner>Submit</ButtonWithSpinner>
        </form>
      </AccordionItem>
    </Accordion>
  )
}
