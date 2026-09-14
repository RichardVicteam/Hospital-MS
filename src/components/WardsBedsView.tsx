import React, { useState } from 'react';
import {
  BedDouble,
  Activity,
  CheckCircle2,
  Sparkles,
  Wrench,
  AlertCircle,
  UserPlus,
  ArrowRightLeft,
  X,
  User,
} from 'lucide-react';
import { Bed, Patient, WardType, BedStatus } from '../types';

interface WardsBedsViewProps {
  beds: Bed[];
  patients: Patient[];
  onUpdateBedStatus: (bedId: string, newStatus: BedStatus, patientId?: string, patientName?: string) => void;
  onSelectPatient: (patientId: string) => void;
}

export const WardsBedsView: React.FC<WardsBedsViewProps> = ({
  beds = [],
  patients = [],
  onUpdateBedStatus,
  onSelectPatient,
}) => {
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [assigningBed, setAssigningBed] = useState<Bed | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  const safeBeds = beds || [];
  const safePatients = patients || [];

  const wardsList: WardType[] = [
    'Intensive Care Unit (ICU)',
    'Cardiology Ward',
    'General Ward',
    'Pediatric Care',
    'Surgical Recovery',
    'Maternity & Neonatal',
  ];

  const totalBeds = safeBeds.length;
  const occupiedCount = safeBeds.filter((b) => b.status === 'Occupied').length;
  const availableCount = safeBeds.filter((b) => b.status === 'Available').length;
  const cleaningCount = safeBeds.filter((b) => b.status === 'Cleaning').length;
  const maintenanceCount = safeBeds.filter((b) => b.status === 'Maintenance').length;
  const occupancyPercentage = totalBeds > 0 ? Math.round((occupiedCount / totalBeds) * 100) : 0;

  const filteredBeds = safeBeds.filter((bed) => {
    return selectedWard === 'All' || bed.ward === selectedWard;
  });

  // Patients who are inpatients without bed or can be assigned
  const assignablePatients = safePatients.filter((p) => p.status === 'Inpatient');

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningBed || !selectedPatientId) return;

    const patient = patients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    onUpdateBedStatus(assigningBed.id, 'Occupied', patient.id, patient.name);
    setAssigningBed(null);
    setSelectedPatientId('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Overall Capacity Statistics */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-indigo-600" />
              Ward Bed Capacity & Inpatient Census Grid
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live bed tracking across ICU, telemetry units, pediatric suites, and surgical recovery
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono">
            <span className="text-slate-500">Hospital Capacity:</span>
            <strong className="text-slate-900 font-bold">{occupancyPercentage}% Occupied</strong>
          </div>
        </div>

        {/* Capacity Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/80">
            <span className="text-[11px] font-semibold text-teal-800 uppercase block">Available Beds</span>
            <span className="text-xl font-bold text-teal-900 font-mono mt-0.5 block">{availableCount} Beds</span>
            <span className="text-[10px] text-teal-600">Sanitized & ready for intake</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-700 uppercase block">Occupied Beds</span>
            <span className="text-xl font-bold text-slate-900 font-mono mt-0.5 block">{occupiedCount} Beds</span>
            <span className="text-[10px] text-slate-500">Active inpatient care</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-800 uppercase block">Terminal Cleaning</span>
            <span className="text-xl font-bold text-amber-900 font-mono mt-0.5 block">{cleaningCount} Beds</span>
            <span className="text-[10px] text-amber-600">Housekeeping sanitization</span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-800 uppercase block">Maintenance / Repair</span>
            <span className="text-xl font-bold text-rose-900 font-mono mt-0.5 block">{maintenanceCount} Beds</span>
            <span className="text-[10px] text-rose-600">Biomedical equipment check</span>
          </div>
        </div>
      </div>

      {/* Ward Tab Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedWard('All')}
          className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            selectedWard === 'All'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Wards ({totalBeds})
        </button>
        {wardsList.map((ward) => {
          const count = beds.filter((b) => b.ward === ward).length;
          return (
            <button
              key={ward}
              onClick={() => setSelectedWard(ward)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedWard === ward
                  ? 'bg-indigo-700 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {ward} ({count})
            </button>
          );
        })}
      </div>

      {/* Bed Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBeds.map((bed) => {
          const isOccupied = bed.status === 'Occupied';
          const isAvailable = bed.status === 'Available';
          const isCleaning = bed.status === 'Cleaning';
          const isMaintenance = bed.status === 'Maintenance';

          return (
            <div
              key={bed.id}
              className={`bg-white rounded-2xl border p-4 shadow-xs transition-all space-y-3 ${
                isOccupied
                  ? 'border-slate-300'
                  : isAvailable
                  ? 'border-teal-300 ring-2 ring-teal-50'
                  : isCleaning
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-rose-200 bg-rose-50/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{bed.bedNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isAvailable
                          ? 'bg-teal-100 text-teal-800'
                          : isOccupied
                          ? 'bg-slate-200 text-slate-800'
                          : isCleaning
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {bed.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">{bed.ward}</span>
                </div>

                <div className="text-right">
                  {isAvailable && (
                    <button
                      onClick={() => setAssigningBed(bed)}
                      className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Assign</span>
                    </button>
                  )}
                  {isCleaning && (
                    <button
                      onClick={() => onUpdateBedStatus(bed.id, 'Available')}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Occupant Details if Occupied */}
              {isOccupied && bed.currentPatientName ? (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[10px] uppercase font-semibold">Current Patient</span>
                    {bed.currentPatientId && (
                      <button
                        onClick={() => onSelectPatient(bed.currentPatientId!)}
                        className="text-teal-700 hover:underline text-[11px] font-semibold cursor-pointer"
                      >
                        Open Dossier
                      </button>
                    )}
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{bed.currentPatientName}</div>
                  <div className="text-[11px] text-slate-500">
                    Admitted: {bed.admissionDate || 'Recent'} • {bed.assignedDoctor || 'Attending Physician'}
                  </div>

                  <div className="pt-2 border-t border-slate-200/70 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onUpdateBedStatus(bed.id, 'Cleaning')}
                      className="text-[11px] text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                    >
                      Vacate & Clean
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 py-1 italic">
                  {isAvailable
                    ? 'Bed ready for immediate patient admission.'
                    : isCleaning
                    ? 'Under terminal sterilization.'
                    : 'Scheduled for biomedical inspection.'}
                </div>
              )}

              {/* Installed Medical Equipment */}
              {bed.equipment.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Equipped Technology
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {bed.equipment.map((eq, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Assign Patient to Bed Modal */}
      {assigningBed && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            <div className="bg-teal-700 text-white p-4 flex items-center justify-between border-b border-teal-800">
              <div className="flex items-center gap-2">
                <BedDouble className="w-5 h-5" />
                <div>
                  <h3 className="text-sm font-bold">Assign Bed {assigningBed.bedNumber}</h3>
                  <p className="text-xs text-teal-100">{assigningBed.ward}</p>
                </div>
              </div>
              <button
                onClick={() => setAssigningBed(null)}
                className="p-1 text-teal-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Select Admitted Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500 bg-white"
                  required
                >
                  <option value="">-- Choose Patient --</option>
                  {assignablePatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.medicalRecordNumber}) - Current: {p.roomBed}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600 text-[11px] space-y-1">
                <p>
                  Assigning this bed will update the patient's EHR location record and mark Bed{' '}
                  <strong>{assigningBed.bedNumber}</strong> as Occupied.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssigningBed(null)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedPatientId}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
