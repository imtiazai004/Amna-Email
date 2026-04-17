import React from 'react';
import { CreditCard, Download, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useFees } from '../hooks/useFees';

export const FeeManagement = () => {
  const { fees, isLoading, payFee, isPaying } = useFees();

  const analytics = [
    { label: 'Total Collections', value: '$' + fees.filter((f: any) => f.status === 'Paid').reduce((acc: number, f: any) => acc + f.amountPaid, 0).toLocaleString(), icon: CreditCard, color: 'blue' },
    { label: 'Active Receivables', value: '$' + fees.filter((f: any) => f.status === 'Pending').reduce((acc: number, f: any) => acc + (f.category?.amount - f.amountPaid), 0).toLocaleString(), icon: Clock, color: 'orange' },
    { label: 'Paid Invoices', value: fees.filter((f: any) => f.status === 'Paid').length.toString(), icon: CheckCircle2, color: 'green' },
    { label: 'Overdue Payments', value: fees.filter((f: any) => f.status === 'Overdue').length.toString(), icon: AlertCircle, color: 'red' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">Financial Governance</h1>
          <p className="text-text-muted text-sm font-medium">Unified fiscal monitoring and billing synchronization</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-border-theme rounded-lg text-[10px] font-black uppercase tracking-widest text-text-main hover:bg-bg transition-all">
            <Download size={14} className="inline mr-2" />
            Financial Audit
          </button>
          <button className="px-5 py-2.5 bg-text-main text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 shadow-sm">
            Generate Invoices
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analytics.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-xl border border-border-theme shadow-sm"
          >
            <div className={`p-2.5 w-fit rounded-lg mb-4 ${
              item.color === 'blue' ? 'bg-[#dbeafe] text-[#1e40af]' :
              item.color === 'green' ? 'bg-[#dcfce7] text-[#166534]' :
              item.color === 'orange' ? 'bg-[#ffedd5] text-[#9a3412]' :
              'bg-[#fee2e2] text-[#991b1b]'
            }`}>
              <item.icon size={20} />
            </div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">{item.label}</p>
            <h3 className="text-2xl font-bold mt-1 text-text-main">{item.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-border-theme overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border-theme bg-white flex justify-between items-center">
            <h3 className="font-bold text-sm text-text-main uppercase tracking-wider">Master Ledger: Recent Transactions</h3>
            <button className="text-primary text-[10px] font-black hover:underline uppercase tracking-widest">Full History</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-black text-text-muted uppercase tracking-[0.1em] bg-bg border-b border-border-theme">
                  <th className="px-6 py-4">Beneficiary</th>
                  <th className="px-6 py-4">Billing Category</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-theme">
                {fees.map((f: any) => (
                  <tr key={f.id} className="text-sm hover:bg-[#f1f5f9] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-bg border border-border-theme flex items-center justify-center font-bold text-[10px] text-text-muted">
                          {f.studentUser?.name.charAt(0)}
                        </div>
                        <span className="font-bold text-text-main">{f.studentUser?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{f.category?.name}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-text-main">${f.amountPaid.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        f.status === 'Paid' ? 'bg-[#dcfce7] text-[#166534]' :
                        f.status === 'Pending' ? 'bg-[#ffedd5] text-[#9a3412]' :
                        'bg-[#fee2e2] text-[#991b1b]'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {f.status !== 'Paid' && (
                        <button 
                          onClick={() => payFee({ id: f.id, amount: f.category?.amount })}
                          disabled={isPaying}
                          className="px-3 py-1 bg-text-main text-white rounded-md text-[9px] font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50 mr-2"
                        >
                          {isPaying ? 'Syncing...' : 'Mark Paid'}
                        </button>
                      )}
                      <button className="p-2 text-text-muted hover:text-primary transition-all">
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border-theme p-6 shadow-sm">
            <h3 className="font-bold text-[11px] text-text-muted mb-6 uppercase tracking-[0.2em]">Automated Billing Reminders</h3>
            <div className="space-y-4">
              {[1, 2].map((_, i) => (
                <div key={i} className="p-4 rounded-lg border border-border-theme bg-bg hover:border-primary/20 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[9px] font-black text-primary px-2 py-0.5 bg-white border border-border-theme rounded uppercase tracking-widest">Scheduled</span>
                    <p className="text-xs font-bold text-text-main">$1,500</p>
                  </div>
                  <h4 className="text-[11px] font-black text-text-main uppercase tracking-tight">Q4 Tuition Fees Generation</h4>
                  <p className="text-[10px] text-text-muted mt-1 font-medium italic">Pending sync with student enrollment data...</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
