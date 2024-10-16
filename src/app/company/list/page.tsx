import CompanyList from '@/components/company/list';

export default function Page() {
  return (
    <div>
      <h2>Companies</h2>
      <table className="border-collapse w-full border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm">
        <thead className="bg-slate-50 dark:bg-slate-700">
          <tr>
            <th className="w-1/4 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Id</th>
            <th className="w-1/2 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Company name</th>
            <th className="w-1/4 border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left">Package price</th>
          </tr>
        </thead>
        <tbody>
          <CompanyList />
        </tbody>
      </table>
    </div>
  );
}