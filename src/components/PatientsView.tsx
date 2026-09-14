import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  HeartPulse,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Patient, PatientStatus, PatientCondition } from '../types';

interface PatientsViewProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onOpenAdmitModal: () => void;
  onOpenRecordVitals: (patient: Patient) => void;
  onDischargePatient: (patientId: string) => void;
}

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients = [],
  onSelectPatient,
  onOpenAdmitModal,
  onOpenRecordVitals,
  onDischargePatient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [conditionFilter, setConditionFilter] = useState<string>('All');

  const safePatients = patients || [];

  const filtered = safePatients.filter((patient) => {
    const matchesSearch =
      (patient.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.medicalRecordNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.diagnosis || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.roomBed || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.assignedDoctorName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;
    const matchesCondition = conditionFilter === 'All' || patient.condition === conditionFilter;

    return matchesSearch && matchesStatus && matchesCondition;
  });

  return (
    <div className="space-y-5">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            Patient Master Directory & Electronic Health Records (EHR)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total of {patients.length} registered patients across inpatient wards, outpatient clinics, and ICU
          </p>
        </div>

        <button
          onClick={onOpenAdmitModal}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Admit New Patient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search patient, MRN, diagnosis, room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Inpatient">Inpatient</option>
              <option value="Outpatient">Outpatient</option>
              <option value="Emergency">Emergency</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-500">Acuity:</span>
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Conditions</option>
              <option value="Critical">Critical</option>
              <option value="Guarded">Guarded</option>
              <option value="Stable">Stable</option>
              <option value="Recovering">Recovering</option>
            </select>
          </div>

          {(searchTerm || statusFilter !== 'All' || conditionFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setConditionFilter('All');
              }}
              className="text-teal-600 hover:text-teal-700 font-semibold px-2 py-1"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Patient Information</th>
                <th className="py-3 px-4">Ward / Room</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Attending Doctor</th>
                <th className="py-3 px-4">Latest Vitals</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No matching patient records located.
                  </td>
                </tr>
              ) : (
                filtered.map((patient) => {
                  const latestVital = patient.vitalsHistory[0];
                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectPatient(patient.id)}
                    >
                      {/* Name & MRN */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">{patient.name}</span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              {patient.medicalRecordNumber}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                              {patient.bloodType}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">
                            {patient.diagnosis}
                          </p>
                          <div className="text-[10px] text-slate-400">
                            {patient.age} yrs • {patient.gender} • Admitted: {patient.admissionDate.slice(0, 10)}
                          </div>
                        </div>
                      </td>

                      {/* Room / Bed */}
                      <td className="py-3 px-4 font-mono font-medium">
                        <span
                          className={`px-2 py-0.5 rounded text-xs inline-block ${
                            patient.roomBed.includes('ICU')
                              ? 'bg-rose-50 text-rose-700 border border-rose-200 font-bold'
                              : patient.roomBed === 'Discharged'
                              ? 'bg-slate-100 text-slate-500'
                              : 'bg-teal-50 text-teal-800 border border-teal-200'
                          }`}
                        >
                          {patient.roomBed}
                        </span>
                      </td>

                      {/* Condition & Status */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                              patient.condition === 'Critical'
                                ? 'bg-rose-100 text-rose-800 animate-pulse'
                                : patient.condition === 'Guarded'
                                ? 'bg-amber-100 text-amber-800'
                                : patient.condition === 'Recovering'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {patient.condition}
                          </span>
                          <span className="block text-[10px] text-slate-500 font-medium">
                            {patient.status}
                          </span>
                        </div>
                      </td>

                      {/* Attending Doctor */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block text-xs">
                          {patient.assignedDoctorName}
                        </span>
                        <span className="text-[10px] text-slate-500">{patient.department}</span>
                      </td>

                      {/* Latest Vitals */}
                      <td className="py-3 px-4 font-mono text-[11px]">
                        {latestVital ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 block">
                              BP: {latestVital.bloodPressure}
                            </span>
                            <span className="text-slate-500 block">
                              HR: {latestVital.heartRate} bpm | SpO2: {latestVital.oxygenSaturation}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No vitals logged</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectPatient(patient.id)}
                            className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            View EHR
                          </button>
                          <button
                            onClick={() => onOpenRecordVitals(patient)}
                            title="Log new vitals"
                            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <HeartPulse className="w-4 h-4 text-rose-600" />
                          </button>
                          {patient.status !== 'Discharged' && (
                            <button
                              onClick={() => {
                                if (confirm(`Discharge patient ${patient.name}?`)) {
                                  onDischargePatient(patient.id);
                                }
                              }}
                              title="Discharge patient"
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <LogOut className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
