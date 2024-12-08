// app/components/invoice/form.tsx

'use client';

import { Accordion, AccordionItem, Select, SelectItem } from "@nextui-org/react";
import { Checkbox } from "@nextui-org/checkbox";
import { DatePicker } from "@nextui-org/date-picker";
import { I18nProvider } from "@react-aria/i18n";
import { Input } from "@nextui-org/react";
import { parse, formatISO } from 'date-fns';
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import ButtonWithSpinner from "@/app/components/common/button-with-spinner";
import type { CompanyIdName } from "@/actions/company-list";
import type { Selection } from "@nextui-org/react";

interface Props {
  caption: string;
  icon: ReactNode;
  action: string | ((formData: FormData) => void | Promise<void>) | undefined;
  companies: CompanyIdName[];
  invoice?: {
    id: string;
    number: string;
    date: string;
    companyId: string;
    amount: number;
    payment: string;
    paid: boolean;
  };
  errors?: {
    number?: string[];
    date?: string[];
    companyId?: string[];
    amount?: string[];
    payment?: string[];
    paid?: string[];
    _form?: string[];
  }
}

type SelectArray = {
  key: string,
  label: string
}

export default function InvoiceForm(props: Props) {
  const { caption, icon, action, companies, invoice, errors} = props;
  const t = useTranslations("ui");
  const companySelect: SelectArray[] = companies.map((company) => {
    return {key: company.id, label: company.name}
  });
  const [selectedCompany, setSelectedCompany] = useState<Selection>(
    invoice?.companyId ? new Set([invoice.companyId]) : new Set([])
  );
  const paymentSelect: SelectArray[] = [
    { key: 'paypal', label: 'PayPal' },
    { key: 'bank_transfer', label: 'Bank Transfer' }
  ];
  const [selectedPayment, setSelectedPayment] = useState<Selection>(
    invoice?.payment ? new Set([invoice.payment]) : new Set([])
  );

  return (
    <Accordion>
      <AccordionItem key="1" aria-label={caption} indicator={icon}>
        <form action={action}>
          {invoice?.id && (
            <Input
              isReadOnly
              name="id"
              label="ID"
              labelPlacement="outside"
              defaultValue={invoice?.id}
            />
          )}
          <Input
            name="number"
            label={t("number")}
            labelPlacement="outside"
            placeholder={t("number")}
            defaultValue={invoice?.number}
            isInvalid={!!errors?.number}
            errorMessage={errors?.number?.join(', ')}
          />
          <I18nProvider locale="IT-it">
          <DatePicker
            name="date"
            label={t("date")}
            labelPlacement="outside"
            defaultValue={
              invoice?.date
              ? parseDate(formatISO(parse(invoice.date, 'dd/MM/yyyy', new Date()), { representation: 'date' }))
              : today(getLocalTimeZone())
            }
            isInvalid={!!errors?.date}
            errorMessage={errors?.date?.join(', ')}
          />
          </I18nProvider>
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
            {(company) => <SelectItem key={company.key}>{company.label}</SelectItem>}
          </Select>
          <Input
            name="amount"
            label={t("amount")}
            labelPlacement="outside"
            placeholder={t("amount")}
            defaultValue={typeof invoice?.amount === 'number' ? invoice?.amount.toFixed(2) : invoice?.amount}
            isInvalid={!!errors?.amount}
            errorMessage={errors?.amount?.join(', ')}
          />
          <Select
            name="payment"
            items={paymentSelect}
            label={t("payment")}
            labelPlacement="outside"
            placeholder={t("payment")}
            selectedKeys={selectedPayment}
            onSelectionChange={setSelectedPayment}
            isInvalid={!!errors?.payment}
            errorMessage={errors?.payment?.join(', ')}
          >
            {paymentSelect.map((payment) => <SelectItem key={payment.key}>{payment.label}</SelectItem>)}
          </Select>

          {invoice?.paid 
            ? <Checkbox name="paid" defaultSelected>{t("paid")}</Checkbox>
            : <Checkbox name="paid">{t("paid")}</Checkbox>}

          {errors?._form ? <div className="text-red">{errors?._form.join(', ')}</div> : null}

          <ButtonWithSpinner>Submit</ButtonWithSpinner>
        </form>
      </AccordionItem>
    </Accordion>
  )
}