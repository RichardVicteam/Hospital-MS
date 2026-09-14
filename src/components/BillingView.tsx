import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  ShieldCheck,
  Receipt,
  X,
} from 'lucide-react';
import { Invoice, Patient, InvoiceItem } from '../types';

interface BillingViewProps {
  invoices: Invoice[];
  patients: Patient[];
  onAddInvoice: (newInvoice: Invoice) => void;
  onUpdateInvoiceStatus: (invoiceId: string, status: any) => void;
  onSelectPatient: (patientId: string) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  invoices = [],
  patients = [],
  onAddInvoice,
  onUpdateInvoiceStatus,
  onSelectPatient,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const safeInvoices = invoices || [];
  const safePatients = patients || [];

  // New Invoice Form
  const [patientId, setPatientId] = useState(safePatients[0]?.id || '');
  const [roomCost, setRoomCost] = useState(1200);
  const [medCost, setMedCost] = useState(350);
  const [labCost, setLabCost] = useState(480);
  const [coveragePct, setCoveragePct] = useState(80);

  const totalBilled = safeInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  const totalPaid = safeInvoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  const totalInsurance = safeInvoices.reduce((acc, inv) => acc + (inv.insuranceCovered || 0), 0);
  const totalPatientDue = safeInvoices.reduce((acc, inv) => acc + (inv.patientDue || 0), 0);

  const filtered = safeInvoices.filter((inv) => {
    return statusFilter === 'All' || inv.status === statusFilter;
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const items: InvoiceItem[] = [
      { id: '1', description: 'Inpatient Room & Continuous Nursing Care', department: 'Wards', amount: Number(roomCost) },
      { id: '2', description: 'Pharmaceutical Formulary Dispensary', department: 'Pharmacy', amount: Number(medCost) },
      { id: '3', description: 'Diagnostic Pathology & Blood Chemistry', department: 'Laboratory', amount: Number(labCost) },
    ];

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const insuranceCovered = Math.round(subtotal * (Number(coveragePct) / 100));
    const patientDue = subtotal - insuranceCovered;

    const newInvoice: Invoice = {
      id: 'INV-' + Math.floor(1000 + Math.random() * 9000),
      patientId: patient.id,
      patientName: patient.name,
      patientMRN: patient.medicalRecordNumber,
      issuedDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      totalAmount: subtotal,
      insuranceCovered,
      patientDue,
      status: 'Pending Insurance',
      items,
      insuranceDetails: {
        provider: patient.insurance.provider,
        policyNumber: patient.insurance.policyNumber,
        claimNumber: 'CLM-' + Math.floor(100000 + Math.random() * 900000),
      },
    };

    onAddInvoice(newInvoice);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Patient Billing & Health Insurance Claims Management
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Itemized clinical billing, third-party payer adjudication, and patient copay processing
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Generate Medical Bill</span>
          </button>
        </div>

        {/* Financial Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-600 uppercase block">Total Clinical Billed</span>
            <span className="text-xl font-bold text-slate-900 font-mono mt-0.5 block">
              ${totalBilled.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500">Gross inpatient & outpatient billing</span>
          </div>

          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/80">
            <span className="text-[11px] font-semibold text-teal-800 uppercase block">Insurance Adjudicated</span>
            <span className="text-xl font-bold text-teal-900 font-mono mt-0.5 block">
              ${totalInsurance.toLocaleString()}
            </span>
            <span className="text-[10px] text-teal-600">Covered by policy claims</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-800 uppercase block">Patient Copay Due</span>
            <span className="text-xl font-bold text-amber-900 font-mono mt-0.5 block">
              ${totalPatientDue.toLocaleString()}
            </span>
            <span className="text-[10px] text-amber-600">Out-of-pocket patient balances</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase block">Settled & Paid</span>
            <span className="text-xl font-bold text-emerald-900 font-mono mt-0.5 block">
              ${totalPaid.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600">Reconciled collections</span>
          </div>
        </div>
      </div>

      {/* Invoice Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Filter Invoices:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
          >
            <option value="All">All Invoices</option>
            <option value="Paid">Paid</option>
            <option value="Pending Insurance">Pending Insurance</option>
            <option value="Partial">Partial</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <span className="text-slate-500 font-mono font-medium">
          {filtered.length} Billing Statements
        </span>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Invoice # & Date</th>
              <th className="py-3 px-4">Patient / MRN</th>
              <th className="py-3 px-4">Insurance Provider & Claim</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Patient Responsibility</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {filtered.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4">
                  <span className="font-bold text-slate-900 block">{inv.id}</span>
                  <span className="text-slate-400 text-[11px] block">{inv.issuedDate}</span>
                </td>

                <td className="py-3 px-4 font-sans">
                  <button
                    onClick={() => onSelectPatient(inv.patientId)}
                    className="font-bold text-slate-900 hover:text-teal-600 block text-left"
                  >
                    {inv.patientName}
                  </button>
                  <span className="text-[10px] font-mono text-slate-400">{inv.patientMRN}</span>
                </td>

                <td className="py-3 px-4 font-sans">
                  {inv.insuranceDetails ? (
                    <div>
                      <span className="font-semibold text-slate-800 block text-xs">
                        {inv.insuranceDetails.provider}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Claim: {inv.insuranceDetails.claimNumber}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Self-Pay (No Insurance)</span>
                  )}
                </td>

                <td className="py-3 px-4 font-bold text-slate-900">
                  ${inv.totalAmount.toLocaleString()}
                </td>

                <td className="py-3 px-4">
                  <span className="font-bold text-amber-800 block">
                    ${inv.patientDue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-sans">
                    Covered: ${inv.insuranceCovered.toLocaleString()}
                  </span>
                </td>

                <td className="py-3 px-4 font-sans">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                      inv.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inv.status === 'Pending Insurance'
                        ? 'bg-sky-100 text-sky-800'
                        : inv.status === 'Partial'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>

                <td className="py-3 px-4 text-right font-sans">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setViewingInvoice(inv)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer shadow-2xs"
                    >
                      View Bill
                    </button>
                    {inv.status !== 'Paid' && (
                      <button
                        onClick={() => onUpdateInvoiceStatus(inv.id, 'Paid')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-2xs transition-colors"
                      >
                        Settle Paid
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Itemized Bill Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            <div className="bg-slate-900 text-white p-5 flex items-start justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold">Itemized Hospital Statement</h3>
                  <p className="text-xs text-slate-400">
                    Invoice {viewingInvoice.id} • {viewingInvoice.patientName} ({viewingInvoice.patientMRN})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingInvoice(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Itemized lines */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Department & Service</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingInvoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3">
                          <span className="font-semibold text-slate-800 block">{item.description}</span>
                          <span className="text-[10px] text-slate-400">{item.department}</span>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          ${item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Totals */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Hospital Total:</span>
                  <span>${viewingInvoice.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-teal-700">
                  <span>Insurance Payer Benefit:</span>
                  <span>-${viewingInvoice.insuranceCovered.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Patient Responsibility Balance:</span>
                  <span className="text-emerald-800">${viewingInvoice.patientDue.toLocaleString()}</span>
                </div>
              </div>

              {viewingInvoice.insuranceDetails && (
                <div className="bg-teal-50/60 p-3 rounded-xl border border-teal-100 text-[11px] space-y-0.5">
                  <span className="font-bold text-teal-900">Insurance Adjudication File:</span>
                  <p className="text-teal-800">
                    Carrier: {viewingInvoice.insuranceDetails.provider} (Policy #{viewingInvoice.insuranceDetails.policyNumber})
                  </p>
                  <p className="text-teal-700">
                    Electronic Claim Transaction ID: {viewingInvoice.insuranceDetails.claimNumber}
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setViewingInvoice(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Close
                </button>
                {viewingInvoice.status !== 'Paid' && (
                  <button
                    onClick={() => {
                      onUpdateInvoiceStatus(viewingInvoice.id, 'Paid');
                      setViewingInvoice(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
                  >
                    Mark as Paid in Full
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            <div className="bg-emerald-700 text-white p-4 flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <div>
                  <h3 className="text-sm font-bold">Generate Patient Billing Statement</h3>
                  <p className="text-xs text-emerald-100">Calculate room, pharmacy & diagnostic charges</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-emerald-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => {
                    setPatientId(e.target.value);
                    const p = patients.find((pat) => pat.id === e.target.value);
                    if (p) setCoveragePct(p.insurance.coveragePercent);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500 bg-white"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.medicalRecordNumber}) - {p.insurance.provider}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3 font-mono">
                <div>
                  <label className="block text-slate-600 font-sans font-semibold mb-1">Ward Room ($)</label>
                  <input
                    type="number"
                    value={roomCost}
                    onChange={(e) => setRoomCost(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-sans font-semibold mb-1">Pharmacy ($)</label>
                  <input
                    type="number"
                    value={medCost}
                    onChange={(e) => setMedCost(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-sans font-semibold mb-1">Diagnostics ($)</label>
                  <input
                    type="number"
                    value={labCost}
                    onChange={(e) => setLabCost(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Insurance Benefit Coverage Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={coveragePct}
                  onChange={(e) => setCoveragePct(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Gross Estimate:</span>
                  <span className="font-bold">${roomCost + medCost + labCost}</span>
                </div>
                <div className="flex justify-between text-teal-700">
                  <span>Insurance ({coveragePct}%):</span>
                  <span>-${Math.round((roomCost + medCost + labCost) * (coveragePct / 100))}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                  <span>Estimated Patient Due:</span>
                  <span>${(roomCost + medCost + labCost) - Math.round((roomCost + medCost + labCost) * (coveragePct / 100))}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Issue Medical Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
