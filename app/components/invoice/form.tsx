// app/components/invoice/form.tsx

'use client';

import { Accordion, AccordionItem, Select, SelectItem } from "@nextui-org/react";
import { Checkbox, CheckboxGroup } from "@nextui-org/checkbox";
import { DatePicker } from "@nextui-org/date-picker";
import { Input } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import ButtonWithSpinner from "@/app/components/common/button-with-spinner";
import type { Company } from "@prisma/client";
type CompanyIdName = Pick<Company, "id" | "name">;

interface Props {
  caption: string;
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
  const { caption, action, companies, invoice, errors} = props;
  const t = useTranslations("ui");
  const companySelect: SelectArray[] = companies.map((company) => {
    return {key: company.id, label: company.name}
  });
  const paymentSelect: SelectArray[] = [
    { key: 'paypal', label: 'PayPal' },
    { key: 'bank_transfer', label: 'Bank Transfer' }
  ];

  return (
    <Accordion variant="shadow">
      <AccordionItem key="1" aria-label={caption} title={caption}>
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
          <DatePicker
            name="date"
            label={t("date")}
            labelPlacement="outside"
            isInvalid={!!errors?.date}
            errorMessage={errors?.date?.join(', ')}
          />
          <Select
            name="companyId"
            items={companySelect}
            label={t("company_name")}
            labelPlacement="outside"
            placeholder={t("company_name")}
            defaultSelectedKeys={invoice?.companyId}
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
            defaultValue={invoice?.amount.toFixed(2)}
            isInvalid={!!errors?.amount}
            errorMessage={errors?.amount?.join(', ')}
          />
          <Select
            name="payment"
            items={paymentSelect}
            label={t("payment")}
            labelPlacement="outside"
            placeholder={t("payment")}
            defaultSelectedKeys={invoice?.payment}
            isInvalid={!!errors?.payment}
            errorMessage={errors?.payment?.join(', ')}
          >
            {(payment) => <SelectItem key={payment.key}>{payment.label}</SelectItem>}
          </Select>
          <CheckboxGroup
            errorMessage={errors?.paid?.join(', ')}
          >
            <Checkbox
              name="paid"
              isInvalid={!!errors?.paid}
            >{t("paid")}
            </Checkbox>
          </CheckboxGroup>

          {errors?._form ? <div className="text-red">{errors?._form.join(', ')}</div> : null}

          <ButtonWithSpinner>Submit</ButtonWithSpinner>
        </form>
      </AccordionItem>
    </Accordion>
  )
}