import React, { useState } from 'react';
import {
  Flame,
  Plus,
  HeartPulse,
  Clock,
  AlertTriangle,
  Ambulance,
  UserCheck,
  CheckCircle2,
  X,
  BedDouble,
} from 'lucide-react';
import { EmergencyCase, TriageAcuity, Patient, Bed } from '../types';

interface EmergencyTriageViewProps {
  emergencyCases: EmergencyCase[];
  beds: Bed[];
  onAddEmergencyCase: (newCase: EmergencyCase) => void;
  onUpdateTriageStatus: (caseId: string, newStatus: any) => void;
  onAdmitEmergencyToWard: (emergencyCase: EmergencyCase, bedId: string) => void;
}

export const EmergencyTriageView: React.FC<EmergencyTriageViewProps> = ({
  emergencyCases = [],
  beds = [],
  onAddEmergencyCase,
  onUpdateTriageStatus,
  onAdmitEmergencyToWard,
}) => {
  const [selectedAcuityFilter, setSelectedAcuityFilter] = useState<string>('All');
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [admittingCase, setAdmittingCase] = useState<EmergencyCase | null>(null);
  const [targetBedId, setTargetBedId] = useState('');

  const safeEmergencyCases = emergencyCases || [];
  const safeBeds = beds || [];

  // Intake Form
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState(42);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [acuity, setAcuity] = useState<TriageAcuity>('Resuscitation - Level 1');
  const [bp, setBp] = useState('85/55');
  const [pulse, setPulse] = useState(130);
  const [spo2, setSpo2] = useState(88);
  const [gcs, setGcs] = useState(13);
  const [triageNurse, setTriageNurse] = useState('Charge Nurse Angela Gomez, RN');

  const filtered = safeEmergencyCases.filter((ec) => {
    return selectedAcuityFilter === 'All' || ec.acuity === selectedAcuityFilter;
  });

  const availableBeds = safeBeds.filter((b) => b.status === 'Available');

  const handleCreateIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !chiefComplaint.trim()) {
      alert('Please fill out patient name and chief complaint.');
      return;
    }

    const newCase: EmergencyCase = {
      id: 'ER-' + Math.floor(100 + Math.random() * 900),
      patientName,
      age: Number(age),
      gender,
      chiefComplaint,
      acuity,
      vitalsAtTriage: {
        bp,
        pulse: Number(pulse),
        spo2: Number(spo2),
      },
      glasgowComaScale: Number(gcs),
      triageNurse,
      arrivedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'In Treatment',
    };

    onAddEmergencyCase(newCase);
    setIsIntakeModalOpen(false);
    setPatientName('');
    setChiefComplaint('');
  };

  const handleAdmitConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admittingCase || !targetBedId) return;

    onAdmitEmergencyToWard(admittingCase, targetBedId);
    setAdmittingCase(null);
    setTargetBedId('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-600 animate-pulse" />
            Emergency Department & Trauma Triage Board
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Emergency Severity Index (ESI) 5-tier triage classification & trauma resuscitation flow
          </p>
        </div>

        <button
          onClick={() => setIsIntakeModalOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Ambulance className="w-4 h-4" />
          <span>+ Rapid Trauma Intake</span>
        </button>
      </div>

      {/* Acuity Tiers Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-medium">
        <button
          onClick={() => setSelectedAcuityFilter('All')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedAcuityFilter === 'All'
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="text-[10px] uppercase font-bold block opacity-70">Overview</span>
          <span className="font-bold text-sm block">All ER Cases</span>
          <span className="text-[11px] font-mono">{emergencyCases.length} Active</span>
        </button>

        <button
          onClick={() => setSelectedAcuityFilter('Resuscitation - Level 1')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedAcuityFilter === 'Resuscitation - Level 1'
              ? 'border-rose-600 bg-rose-600 text-white shadow-xs'
              : 'border-rose-200 bg-rose-50/50 text-rose-950 hover:bg-rose-100/50'
          }`}
        >
          <span className="text-[10px] uppercase font-bold block text-rose-600">Level 1 (STAT)</span>
          <span className="font-bold text-sm block">Resuscitation</span>
          <span className="text-[11px] font-mono">Immediate Care</span>
        </button>

        <button
          onClick={() => setSelectedAcuityFilter('Emergent - Level 2')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedAcuityFilter === 'Emergent - Level 2'
              ? 'border-amber-600 bg-amber-600 text-white shadow-xs'
              : 'border-amber-200 bg-amber-50/50 text-amber-950 hover:bg-amber-100/50'
          }`}
        >
          <span className="text-[10px] uppercase font-bold block text-amber-600">Level 2</span>
          <span className="font-bold text-sm block">Emergent</span>
          <span className="text-[11px] font-mono">&lt; 15 min window</span>
        </button>

        <button
          onClick={() => setSelectedAcuityFilter('Urgent - Level 3')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedAcuityFilter === 'Urgent - Level 3'
              ? 'border-yellow-600 bg-yellow-600 text-white shadow-xs'
              : 'border-yellow-200 bg-yellow-50/50 text-yellow-950 hover:bg-yellow-100/50'
          }`}
        >
          <span className="text-[10px] uppercase font-bold block text-yellow-700">Level 3</span>
          <span className="font-bold text-sm block">Urgent</span>
          <span className="text-[11px] font-mono">&lt; 30 min window</span>
        </button>

        <button
          onClick={() => setSelectedAcuityFilter('Less Urgent - Level 4')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedAcuityFilter === 'Less Urgent - Level 4'
              ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
              : 'border-teal-200 bg-teal-50/50 text-teal-950 hover:bg-teal-100/50'
          }`}
        >
          <span className="text-[10px] uppercase font-bold block text-teal-700">Level 4</span>
          <span className="font-bold text-sm block">Less Urgent</span>
          <span className="text-[11px] font-mono">&lt; 60 min window</span>
        </button>
      </div>

      {/* Emergency Cases List */}
      <div className="space-y-3">
        {filtered.map((erCase) => {
          const isL1 = erCase.acuity.includes('Level 1');
          const isL2 = erCase.acuity.includes('Level 2');

          return (
            <div
              key={erCase.id}
              className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                isL1
                  ? 'border-rose-400 ring-2 ring-rose-100'
                  : isL2
                  ? 'border-amber-300'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono font-bold text-sm text-slate-900">{erCase.id}</span>
                  <span className="font-bold text-base text-slate-900">{erCase.patientName}</span>
                  <span className="text-xs text-slate-500">
                    {erCase.age} yrs • {erCase.gender}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isL1
                        ? 'bg-rose-600 text-white animate-pulse'
                        : isL2
                        ? 'bg-amber-500 text-white'
                        : 'bg-yellow-100 text-yellow-900'
                    }`}
                  >
                    {erCase.acuity}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Stage: {erCase.status}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <span className="text-rose-600 font-bold uppercase text-[10px] tracking-wider">
                    Chief Complaint:
                  </span>
                  <span>{erCase.chiefComplaint}</span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono pt-1 text-slate-600 flex-wrap">
                  <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    BP: <strong className="text-slate-900">{erCase.vitalsAtTriage.bp}</strong>
                  </span>
                  <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    Pulse: <strong className="text-slate-900">{erCase.vitalsAtTriage.pulse} bpm</strong>
                  </span>
                  <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    SpO2: <strong className="text-slate-900">{erCase.vitalsAtTriage.spo2}%</strong>
                  </span>
                  {erCase.glasgowComaScale && (
                    <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-bold text-indigo-700">
                      GCS: {erCase.glasgowComaScale}/15
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 font-sans">
                    Arrived: {erCase.arrivedAt.slice(11, 16)} • {erCase.triageNurse}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {erCase.status !== 'Admitted to Inpatient' && erCase.status !== 'Discharged' && (
                  <>
                    <button
                      onClick={() => setAdmittingCase(erCase)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <BedDouble className="w-3.5 h-3.5" />
                      <span>Admit to Ward / ICU</span>
                    </button>

                    <select
                      value={erCase.status}
                      onChange={(e) => onUpdateTriageStatus(erCase.id, e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      <option value="Triage">Triage</option>
                      <option value="Resuscitation">Resuscitation</option>
                      <option value="In Treatment">In Treatment</option>
                      <option value="Discharged">Discharge from ER</option>
                    </select>
                  </>
                )}
                {erCase.status === 'Admitted to Inpatient' && (
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold rounded-xl text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Inpatient Admitted</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rapid Intake Modal */}
      {isIntakeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            <div className="bg-rose-700 text-white p-4 flex items-center justify-between border-b border-rose-800">
              <div className="flex items-center gap-2">
                <Ambulance className="w-5 h-5" />
                <div>
                  <h3 className="text-sm font-bold">Emergency Trauma Intake</h3>
                  <p className="text-xs text-rose-100">Immediate Triage Classification & Vital Signs</p>
                </div>
              </div>
              <button
                onClick={() => setIsIntakeModalOpen(false)}
                className="p-1 text-rose-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIntake} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Patient or John/Jane Doe"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-rose-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Triage Acuity (ESI Tier)</label>
                <select
                  value={acuity}
                  onChange={(e) => setAcuity(e.target.value as TriageAcuity)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-rose-500 bg-white font-bold"
                >
                  <option value="Resuscitation - Level 1">Resuscitation - Level 1 (Immediate)</option>
                  <option value="Emergent - Level 2">Emergent - Level 2 (Within 15 mins)</option>
                  <option value="Urgent - Level 3">Urgent - Level 3 (Within 30 mins)</option>
                  <option value="Less Urgent - Level 4">Less Urgent - Level 4 (Within 60 mins)</option>
                  <option value="Non-Urgent - Level 5">Non-Urgent - Level 5 (Within 120 mins)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Chief Presenting Complaint *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blunt chest trauma following vehicular collision, acute dyspnea"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-rose-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-4 gap-2 font-mono">
                <div>
                  <label className="block text-slate-600 font-sans font-semibold mb-1">BP (mmHg)</label>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-sans font-semibold mb-1">Pulse (bpm)</label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-sans font-semibold mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-sans font-semibold mb-1">GCS (/15)</label>
                  <input
                    type="number"
                    min="3"
                    max="15"
                    value={gcs}
                    onChange={(e) => setGcs(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Triage Nurse</label>
                <input
                  type="text"
                  value={triageNurse}
                  onChange={(e) => setTriageNurse(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIntakeModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Confirm Emergency Triage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Inpatient Admission Modal */}
      {admittingCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            <div className="bg-indigo-800 text-white p-4 flex items-center justify-between border-b border-indigo-900">
              <div className="flex items-center gap-2">
                <BedDouble className="w-5 h-5" />
                <div>
                  <h3 className="text-sm font-bold">Transfer & Admit to Inpatient Ward</h3>
                  <p className="text-xs text-indigo-200">{admittingCase.patientName}</p>
                </div>
              </div>
              <button
                onClick={() => setAdmittingCase(null)}
                className="p-1 text-indigo-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdmitConfirm} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Select Destination Ward Bed
                </label>
                <select
                  value={targetBedId}
                  onChange={(e) => setTargetBedId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 bg-white font-mono"
                  required
                >
                  <option value="">-- Choose Available Bed --</option>
                  {availableBeds.map((bed) => (
                    <option key={bed.id} value={bed.id}>
                      {bed.bedNumber} ({bed.ward})
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-slate-500 text-[11px] leading-relaxed">
                This will automatically generate a new permanent Inpatient EHR record for{' '}
                <strong>{admittingCase.patientName}</strong>, mark the selected bed as occupied, and
                update ER triage disposition to "Admitted to Inpatient".
              </p>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdmittingCase(null)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!targetBedId}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Confirm Inpatient Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
