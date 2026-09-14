import React, { useState } from 'react';
import {
  X,
  HeartPulse,
  Pill,
  FlaskConical,
  Receipt,
  AlertCircle,
  Clock,
  User,
  Shield,
  Phone,
  FileText,
  Plus,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  Patient,
  Prescription,
  LabTest,
  Invoice,
  PatientStatus,
  PatientCondition,
} from '../types';

interface PatientDossierModalProps {
  patient: Patient | null;
  prescriptions?: Prescription[];
  labs?: LabTest[];
  invoices?: Invoice[];
  isOpen: boolean;
  onClose: () => void;
  onUpdatePatient?: (updated: Patient) => void;
  onOpenRecordVitals?: (patient: Patient) => void;
  onOpenPrescribe?: (patient: Patient) => void;
  onOpenOrderLab?: (patient: Patient) => void;
  onDispensePrescription?: (rxId: string) => void;
}

export const PatientDossierModal: React.FC<PatientDossierModalProps> = ({
  patient,
  prescriptions = [],
  labs = [],
  invoices = [],
  isOpen,
  onClose,
  onUpdatePatient = (_p?: any) => {},
  onOpenRecordVitals = (_p?: any) => {},
  onOpenPrescribe = (_p?: any) => {},
  onOpenOrderLab = (_p?: any) => {},
  onDispensePrescription = (_rxId?: any) => {},
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'vitals' | 'meds' | 'labs' | 'billing'>('summary');

  if (!isOpen || !patient) return null;

  const patientPrescriptions = (prescriptions || []).filter((p) => p.patientId === patient.id);
  const patientLabs = (labs || []).filter((l) => l.patientId === patient.id);
  const patientInvoices = (invoices || []).filter((i) => i.patientId === patient.id);

  const handleStatusChange = (newStatus: PatientStatus) => {
    const updated: Patient = {
      ...patient,
      status: newStatus,
      dischargeDate: newStatus === 'Discharged' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : undefined,
      roomBed: newStatus === 'Discharged' ? 'Discharged' : patient.roomBed,
    };
    onUpdatePatient(updated);
  };

  const handleConditionChange = (newCondition: PatientCondition) => {
    const updated: Patient = {
      ...patient,
      condition: newCondition,
    };
    onUpdatePatient(updated);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
        {/* Modal Header: Patient Key Clinical Demographic Banner */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold tracking-tight text-white">{patient.name}</h2>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
                {patient.medicalRecordNumber}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Blood: {patient.bloodType}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {patient.age} yrs • {patient.gender}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="text-slate-400">Location:</span>{' '}
                <strong className="text-white font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                  {patient.roomBed}
                </strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="text-slate-400">Attending:</span>{' '}
                <strong className="text-teal-300">{patient.assignedDoctorName}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="text-slate-400">Admitted:</span> {patient.admissionDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clinical Control Toolbar */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-600">Care Status:</span>
              <select
                value={patient.status}
                onChange={(e) => handleStatusChange(e.target.value as PatientStatus)}
                className="bg-white border border-slate-300 rounded-lg px-2 py-1 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="Inpatient">Inpatient</option>
                <option value="Outpatient">Outpatient</option>
                <option value="Emergency">Emergency</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-600">Condition:</span>
              <select
                value={patient.condition}
                onChange={(e) => handleConditionChange(e.target.value as PatientCondition)}
                className={`border rounded-lg px-2 py-1 font-semibold focus:outline-none ${
                  patient.condition === 'Critical'
                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                    : patient.condition === 'Guarded'
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                }`}
              >
                <option value="Stable">Stable</option>
                <option value="Recovering">Recovering</option>
                <option value="Guarded">Guarded</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenRecordVitals(patient)}
              className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Record Vitals</span>
            </button>
            <button
              onClick={() => onOpenPrescribe(patient)}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Pill className="w-3.5 h-3.5 text-amber-600" />
              <span>Prescribe Rx</span>
            </button>
            <button
              onClick={() => onOpenOrderLab(patient)}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />
              <span>Order Lab</span>
            </button>
          </div>
        </div>

        {/* Secondary Subtabs: Summary / Vitals / Meds / Labs / Billing */}
        <div className="border-b border-slate-200 bg-white px-5 flex gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('summary')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'summary'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Clinical Overview
          </button>
          <button
            onClick={() => setActiveSubTab('vitals')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'vitals'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Vitals Flowsheet ({patient.vitalsHistory.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('meds')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'meds'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Prescriptions ({patientPrescriptions.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('labs')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'labs'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Lab Diagnostic Tests ({patientLabs.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('billing')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'billing'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Invoices ({patientInvoices.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: CLINICAL OVERVIEW */}
          {activeSubTab === 'summary' && (
            <div className="space-y-6">
              {/* Allergy Warning Box */}
              {patient.allergies.length > 0 && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                      Critical Allergy Warnings
                    </h4>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {patient.allergies.map((allergy, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-200 text-rose-900 border border-rose-300"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Diagnosis & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    Primary Diagnosis
                  </h4>
                  <p className="text-sm font-medium text-slate-900 leading-relaxed">
                    {patient.diagnosis}
                  </p>
                  <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                    Clinical Department: <strong>{patient.department}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    Insurance & Coverage
                  </h4>
                  <p className="text-sm font-medium text-slate-900">
                    {patient.insurance.provider}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Policy #: {patient.insurance.policyNumber}
                  </p>
                  <div className="text-xs text-slate-500 pt-1">
                    Coverage Level: <strong className="text-emerald-700">{patient.insurance.coveragePercent}%</strong> covered
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-600" />
                  Demographic & Emergency Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Patient Phone:</span>
                    <span className="font-semibold text-slate-800">{patient.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Residential Address:</span>
                    <span className="font-semibold text-slate-800">{patient.address}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Emergency Contact:</span>
                    <span className="font-semibold text-slate-800">
                      {patient.emergencyContact.name} ({patient.emergencyContact.relationship}) - {patient.emergencyContact.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Physician Clinical Treatment Notes */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Attending Physician Notes
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono">
                  {patient.notes || 'No specialized physician notes entered.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: VITALS FLOWSHEET */}
          {activeSubTab === 'vitals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Hemodynamic & Vital Signs Flowsheet
                </h4>
                <button
                  onClick={() => onOpenRecordVitals(patient)}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log New Vitals Entry</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Date & Time</th>
                      <th className="py-2.5 px-3">Blood Pressure</th>
                      <th className="py-2.5 px-3">Heart Rate</th>
                      <th className="py-2.5 px-3">Temp (°C)</th>
                      <th className="py-2.5 px-3">SpO2 (%)</th>
                      <th className="py-2.5 px-3">Resp Rate</th>
                      <th className="py-2.5 px-3">Recorded By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {patient.vitalsHistory.map((vital) => (
                      <tr key={vital.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 text-slate-700">{vital.recordedAt}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{vital.bloodPressure}</td>
                        <td className="py-2.5 px-3 text-slate-800">{vital.heartRate} bpm</td>
                        <td className="py-2.5 px-3 text-slate-800">{vital.temperature}°C</td>
                        <td className="py-2.5 px-3 font-semibold text-teal-700">{vital.oxygenSaturation}%</td>
                        <td className="py-2.5 px-3 text-slate-800">{vital.respiratoryRate}/min</td>
                        <td className="py-2.5 px-3 font-sans text-slate-600">{vital.recordedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PRESCRIPTIONS & MEDS */}
          {activeSubTab === 'meds' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Active & Historical Prescriptions
                </h4>
                <button
                  onClick={() => onOpenPrescribe(patient)}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Write New Prescription</span>
                </button>
              </div>

              {patientPrescriptions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                  No active prescriptions on file for this patient.
                </div>
              ) : (
                <div className="space-y-3">
                  {patientPrescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{rx.medicationName}</span>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {rx.id}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              rx.status === 'Dispensed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {rx.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          <strong>Dosage:</strong> {rx.dosage} • <strong>Frequency:</strong> {rx.frequency} • <strong>Duration:</strong> {rx.duration}
                        </p>
                        <p className="text-[11px] text-slate-500 italic">{rx.instructions}</p>
                        <p className="text-[10px] text-slate-400">
                          Prescribed by {rx.doctorName} on {rx.prescribedDate}
                        </p>
                      </div>

                      <div>
                        {rx.status === 'Pending Dispense' && (
                          <button
                            onClick={() => onDispensePrescription(rx.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Dispense Medication</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: LABORATORY RESULTS */}
          {activeSubTab === 'labs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Diagnostic & Pathology Tests
                </h4>
                <button
                  onClick={() => onOpenOrderLab(patient)}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Order Diagnostic Lab</span>
                </button>
              </div>

              {patientLabs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                  No laboratory investigations ordered for this patient.
                </div>
              ) : (
                <div className="space-y-4">
                  {patientLabs.map((lab) => (
                    <div key={lab.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{lab.testName}</span>
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {lab.testCode}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {lab.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Ordered: {lab.orderedDate} by {lab.orderedByDoctor}
                          </p>
                        </div>

                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            lab.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {lab.status}
                        </span>
                      </div>

                      {/* Results table if completed */}
                      {lab.results && lab.results.length > 0 && (
                        <div className="border border-slate-100 rounded-lg overflow-hidden font-mono text-xs">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-sans">
                              <tr>
                                <th className="p-2">Analyte / Parameter</th>
                                <th className="p-2">Observed Value</th>
                                <th className="p-2">Reference Range</th>
                                <th className="p-2">Flag</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {lab.results.map((res, idx) => (
                                <tr key={idx}>
                                  <td className="p-2 font-medium text-slate-800 font-sans">{res.parameter}</td>
                                  <td className="p-2 font-bold text-slate-900">{res.value} {res.unit}</td>
                                  <td className="p-2 text-slate-500">{res.referenceRange}</td>
                                  <td className="p-2">
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                        res.flag === 'Normal'
                                          ? 'bg-slate-100 text-slate-600'
                                          : res.flag === 'High'
                                          ? 'bg-amber-100 text-amber-800'
                                          : res.flag === 'Low'
                                          ? 'bg-sky-100 text-sky-800'
                                          : 'bg-rose-100 text-rose-800 font-bold'
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
                      )}

                      {lab.pathologistNotes && (
                        <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700">
                          <strong>Pathology / Radiologist Impression:</strong> {lab.pathologistNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: BILLING & INVOICES */}
          {activeSubTab === 'billing' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Hospital Statements & Invoices
              </h4>

              {patientInvoices.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                  No billing statements currently generated for this patient.
                </div>
              ) : (
                <div className="space-y-3">
                  {patientInvoices.map((inv) => (
                    <div key={inv.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-xs text-slate-900 font-mono">
                            {inv.invoiceNumber}
                          </span>
                          <span className="text-xs text-slate-500 ml-2">Issued: {inv.date}</span>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.status === 'Claim Processing'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-100 font-mono">
                        <div>
                          <span className="text-slate-400 block font-sans text-[11px]">Subtotal:</span>
                          <span className="font-bold text-slate-800">${inv.subtotal.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-sans text-[11px]">Insurance Coverage:</span>
                          <span className="font-bold text-teal-700">-${inv.insuranceDiscount.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-sans text-[11px]">Patient Payable:</span>
                          <span className="font-bold text-slate-900">${inv.totalDue.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
