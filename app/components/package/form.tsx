// app/components/package/form.tsx

'use client';

import { Accordion, AccordionItem, Select, SelectItem } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import ButtonWithSpinner from "@/app/components/common/button-with-spinner";
import type { CompanyIdName } from "@/actions/company-list";
import type { InvoiceIdNumber } from "@/actions/invoice-list";
import type { Selection } from "@nextui-org/react";

interface Props {
  caption: string;
  icon: ReactNode;
  action: string | ((formData: FormData) => void | Promise<void>) | undefined;
  companies: CompanyIdName[];
  invoices: InvoiceIdNumber[];
  thePackage?: {
    name: string;
    id: string;
    companyId: string;
    invoiceId: string | null;
    carried: number;
    createdAt: Date;
    updatedAt: Date;
  };
  errors?: {
    name?: string[];
    companyId?: string[];
    invoiceId?: string[];
    carried?: string[];
    _form?: string[];
  }
}

type SelectArray = {
  key: string,
  label: string
}

export default function PackageForm(props: Props) {
  const { caption, icon, action, companies, invoices, thePackage, errors } = props;
  const t = useTranslations("ui");

  const companySelect: SelectArray[] = companies.map((company) => {
    return {key: company.id, label: company.name}
  });
  const [selectedCompany, setSelectedCompany] = useState<Selection>(
    thePackage?.companyId ? new Set([thePackage.companyId]) : new Set([])
  );

  const invoiceSelect: SelectArray[] = invoices.map((invoice) => {
    return {key: invoice.id, label: invoice.number}
  });
  const [selectedInvoice, setSelectedInvoice] = useState<Selection>(
    thePackage?.invoiceId ? new Set([thePackage.invoiceId]) : new Set([])
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

  return (
    <Accordion>
      <AccordionItem key="1" {...accordionProps}>
        <form action={action}>
          {thePackage?.id && (
            <Input
              isReadOnly
              name="id"
              label="ID"
              labelPlacement="outside"
              defaultValue={thePackage?.id}
            />
          )}
          <Input
            name="name"
            label={t("name")}
            labelPlacement="outside"
            placeholder={t("name")}
            defaultValue={thePackage?.name}
            isInvalid={!!errors?.name}
            errorMessage={errors?.name?.join(', ')}
          />
          <Select
            name="companyId"
            items={companySelect}
            label={t("company_name")}
            labelPlacement="outside"
            placeholder={t("company_name")}
            selectedKeys={selectedCompany}
            onSelectionChange={setSelectedCompany}
            isInvalid={!!errors?.companyId}
            errorMessage={errors?.companyId?.join(', ')}
          >
            {(company) => <SelectItem key={company.key} textValue={company.label}>{company.label}</SelectItem>}
          </Select>
          <Input
            name="carried"
            label={t("amount_carried_forward")}
            labelPlacement="outside"
            placeholder={t("amount_carried_forward")}
            defaultValue={typeof thePackage?.carried === 'number' ? thePackage?.carried.toFixed(0) : thePackage?.carried}
            isInvalid={!!errors?.carried}
            errorMessage={errors?.carried?.join(', ')}
          />
          <Select
            name="invoiceId"
            items={invoiceSelect}
            label={t("invoice_number")}
            labelPlacement="outside"
            placeholder={t("invoice_number")}
            selectedKeys={selectedInvoice}
            onSelectionChange={setSelectedInvoice}
            isInvalid={!!errors?.invoiceId}
            errorMessage={errors?.invoiceId?.join(', ')}
          >
            {(invoice) => <SelectItem key={invoice.key} textValue={invoice.label}>{invoice.label}</SelectItem>}
          </Select>

          {errors?._form ? <div className="text-red">{errors?._form.join(', ')}</div> : null}

          <ButtonWithSpinner>Submit</ButtonWithSpinner>
        </form>
      </AccordionItem>
    </Accordion>
  )
}