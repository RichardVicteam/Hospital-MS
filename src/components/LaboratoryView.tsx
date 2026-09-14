import React, { useState } from 'react';
import {
  FlaskConical,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Activity,
  Filter,
  X,
  ChevronRight,
} from 'lucide-react';
import { LabTest, Patient, Doctor, LabTestStatus } from '../types';

interface LaboratoryViewProps {
  labs: LabTest[];
  patients: Patient[];
  doctors: Doctor[];
  onAddLabTest: (newTest: LabTest) => void;
  onUpdateLabStatus: (testId: string, newStatus: LabTestStatus) => void;
  onSelectPatient: (patientId: string) => void;
}

export const LaboratoryView: React.FC<LaboratoryViewProps> = ({
  labs = [],
  patients = [],
  doctors = [],
  onAddLabTest,
  onUpdateLabStatus,
  onSelectPatient,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [viewingLab, setViewingLab] = useState<LabTest | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const safeLabs = labs || [];
  const safePatients = patients || [];
  const safeDoctors = doctors || [];

  // New Lab Order Form
  const [patientId, setPatientId] = useState(safePatients[0]?.id || '');
  const [doctorId, setDoctorId] = useState(safeDoctors[0]?.id || '');
  const [testName, setTestName] = useState('Complete Blood Count with Differential (CBC)');
  const [category, setCategory] = useState<any>('Hematology');
  const [priority, setPriority] = useState<any>('Routine');
  const [indications, setIndications] = useState('');

  const filtered = safeLabs.filter((lab) => {
    const matchStatus = statusFilter === 'All' || lab.status === statusFilter;
    const matchCat = categoryFilter === 'All' || lab.category === categoryFilter;
    return matchStatus && matchCat;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!patient || !doctor) return;

    const newLab: LabTest = {
      id: 'LAB-' + Math.floor(100 + Math.random() * 900),
      testCode: category.slice(0, 3).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000),
      patientId: patient.id,
      patientName: patient.name,
      orderedByDoctor: doctor.name,
      testName,
      category,
      orderedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Ordered',
      priority,
      pathologistNotes: indications ? `Clinical notes: ${indications}` : undefined,
    };

    onAddLabTest(newLab);
    setIsOrderModalOpen(false);
    setIndications('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-600" />
            Diagnostic Pathology & Laboratory Services
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hematology, biochemistry, microbiology, and radiological diagnostic test queue
          </p>
        </div>

        <button
          onClick={() => setIsOrderModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Order Diagnostic Test</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Ordered">Ordered</option>
              <option value="Sample Collected">Sample Collected</option>
              <option value="Analyzing">Analyzing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Hematology">Hematology</option>
              <option value="Biochemistry">Biochemistry</option>
              <option value="Radiology">Radiology</option>
              <option value="Microbiology">Microbiology</option>
              <option value="Cardiopulmonary">Cardiopulmonary</option>
            </select>
          </div>
        </div>

        <span className="text-slate-500 font-mono font-medium">
          {filtered.length} Diagnostic Tests In Workflow
        </span>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Test Code & Date</th>
              <th className="py-3 px-4">Patient</th>
              <th className="py-3 px-4">Investigation Name</th>
              <th className="py-3 px-4">Category & Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Workflow Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400">
                  No diagnostic tests found for selected criteria.
                </td>
              </tr>
            ) : (
              filtered.map((lab) => {
                const isStat = lab.priority.includes('STAT');
                return (
                  <tr key={lab.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-slate-900 block">{lab.testCode}</span>
                      <span className="text-slate-400 text-[11px] block">{lab.orderedDate}</span>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => onSelectPatient(lab.patientId)}
                        className="font-bold text-slate-900 hover:text-teal-600 block text-left"
                      >
                        {lab.patientName}
                      </button>
                      <span className="text-[10px] text-slate-400">Ordered by {lab.orderedByDoctor}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block text-xs">{lab.testName}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {lab.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isStat
                              ? 'bg-rose-100 text-rose-800 animate-pulse'
                              : lab.priority === 'Urgent'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {lab.priority}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                          lab.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lab.status === 'Analyzing'
                            ? 'bg-indigo-100 text-indigo-800 animate-pulse'
                            : lab.status === 'Sample Collected'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {lab.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {lab.status === 'Ordered' && (
                          <button
                            onClick={() => onUpdateLabStatus(lab.id, 'Sample Collected')}
                            className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold rounded-lg text-xs cursor-pointer"
                          >
                            Collect Sample
                          </button>
                        )}
                        {lab.status === 'Sample Collected' && (
                          <button
                            onClick={() => onUpdateLabStatus(lab.id, 'Analyzing')}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-semibold rounded-lg text-xs cursor-pointer"
                          >
                            Begin Analysis
                          </button>
                        )}
                        {lab.status === 'Analyzing' && (
                          <button
                            onClick={() => onUpdateLabStatus(lab.id, 'Completed')}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg text-xs cursor-pointer"
                          >
                            Finalize Report
                          </button>
                        )}
                        <button
                          onClick={() => setViewingLab(lab)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer shadow-2xs"
                        >
                          View Report
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Lab Report Dossier Modal */}
      {viewingLab && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            <div className="bg-indigo-900 text-white p-5 flex items-start justify-between border-b border-indigo-950">
              <div>
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-indigo-300" />
                  <h3 className="text-base font-bold">{viewingLab.testName}</h3>
                </div>
                <div className="text-xs text-indigo-200 mt-1 flex items-center gap-3">
                  <span>Code: <strong className="font-mono text-white">{viewingLab.testCode}</strong></span>
                  <span>•</span>
                  <span>Patient: <strong className="text-white">{viewingLab.patientName}</strong></span>
                  <span>•</span>
                  <span>Status: <strong className="text-emerald-300">{viewingLab.status}</strong></span>
                </div>
              </div>
              <button
                onClick={() => setViewingLab(null)}
                className="p-1 text-indigo-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {viewingLab.results && viewingLab.results.length > 0 ? (
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2 text-[11px]">
                    Laboratory Analyte Values & Diagnostic Flags
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden font-mono">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-sans uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Analyte</th>
                          <th className="p-2.5">Result</th>
                          <th className="p-2.5">Biological Reference Range</th>
                          <th className="p-2.5">Flag</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {viewingLab.results.map((res, i) => (
                          <tr key={i} className="hover:bg-slate-50/60">
                            <td className="p-2.5 font-sans font-medium text-slate-900">{res.parameter}</td>
                            <td className="p-2.5 font-bold text-slate-900">{res.value} {res.unit}</td>
                            <td className="p-2.5 text-slate-500">{res.referenceRange}</td>
                            <td className="p-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  res.flag === 'Normal'
                                    ? 'bg-slate-100 text-slate-700'
                                    : res.flag === 'High'
                                    ? 'bg-amber-100 text-amber-800'
                                    : res.flag === 'Low'
                                    ? 'bg-sky-100 text-sky-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {res.flag}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Laboratory results are pending analytical processing.
                </div>
              )}

              {viewingLab.pathologistNotes && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">
                    Pathologist / Radiologist Diagnostic Impression:
                  </span>
                  <p className="text-slate-700 leading-relaxed font-sans">{viewingLab.pathologistNotes}</p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setViewingLab(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold cursor-pointer hover:bg-slate-800"
                >
                  Close Diagnostic Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order New Lab Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            <div className="bg-indigo-700 text-white p-4 flex items-center justify-between border-b border-indigo-800">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5" />
                <div>
                  <h3 className="text-sm font-bold">Order Diagnostic Lab Investigation</h3>
                  <p className="text-xs text-indigo-100">Select test panel and urgency priority</p>
                </div>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="p-1 text-indigo-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.medicalRecordNumber}) - {p.roomBed}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Ordering Physician</label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Hematology">Hematology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Cardiopulmonary">Cardiopulmonary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Urgency Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 bg-white font-bold"
                  >
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="STAT (Emergency)">STAT (Emergency)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Investigation Name *</label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Clinical Indications</label>
                <textarea
                  rows={2}
                  placeholder="Suspected pathology, ruling out sepsis, post-operative routine..."
                  value={indications}
                  onChange={(e) => setIndications(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Dispatch Lab Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
