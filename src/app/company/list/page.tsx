// src/app/company/list/page.tsx

import CompanyList from '@/components/company/list';
import NewCompany from '@/components/company/new';

export default function Page() {
  return (
    <div>
      <div className="py-6">
        <h2 className="text-2xl text-bold">Companies</h2>
      </div>
      <table className="border-collapse w-full border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm">
        <thead className="bg-slate-50 dark:bg-slate-700">
          <tr>
            <th className="w-1/12 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">
            </th>
            <th className="w-2/12 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-base text-slate-900 dark:text-slate-200 text-left">
              Id
            </th>
            <th className="w-1/2 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-base text-slate-900 dark:text-slate-200 text-left">
              Company name
            </th>
            <th className="w-1/4 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-base text-slate-900 dark:text-slate-200 text-left">
              Package price
            </th>
          </tr>
        </thead>
        <tbody>
          <CompanyList />
        </tbody>
      </table>
      <NewCompany />
    </div>
  );
}