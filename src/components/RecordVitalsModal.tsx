import React, { useState } from 'react';
import { X, HeartPulse, CheckCircle2 } from 'lucide-react';
import { Patient, PatientVitals } from '../types';

interface RecordVitalsModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveVitals: (patientId: string, vitals: PatientVitals) => void;
}

export const RecordVitalsModal: React.FC<RecordVitalsModalProps> = ({
  patient,
  isOpen,
  onClose,
  onSaveVitals,
}) => {
  const [bp, setBp] = useState('120/80');
  const [heartRate, setHeartRate] = useState(72);
  const [temp, setTemp] = useState(36.7);
  const [spo2, setSpo2] = useState(98);
  const [respRate, setRespRate] = useState(16);
  const [nurseName, setNurseName] = useState('Nurse Clara Brooks, RN');

  if (!isOpen || !patient) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').slice(0, 16);

    const newVitals: PatientVitals = {
      id: 'VIT-' + Date.now(),
      bloodPressure: bp,
      heartRate: Number(heartRate),
      temperature: Number(temp),
      oxygenSaturation: Number(spo2),
      respiratoryRate: Number(respRate),
      recordedAt: formattedDate,
      recordedBy: nurseName,
    };

    onSaveVitals(patient.id, newVitals);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Record Vital Signs</h3>
              <p className="text-xs text-slate-400">
                {patient.name} ({patient.medicalRecordNumber})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 font-mono">
            <div>
              <label className="block text-slate-600 font-sans font-semibold mb-1">Blood Pressure</label>
              <input
                type="text"
                required
                placeholder="120/80"
                value={bp}
                onChange={(e) => setBp(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500 focus:outline-none text-center font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-sans font-semibold mb-1">Heart Rate (bpm)</label>
              <input
                type="number"
                required
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500 focus:outline-none text-center font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-sans font-semibold mb-1">Body Temp (°C)</label>
              <input
                type="number"
                step="0.1"
                required
                value={temp}
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500 focus:outline-none text-center font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-sans font-semibold mb-1">Oxygen Saturation (%)</label>
              <input
                type="number"
                required
                min="50"
                max="100"
                value={spo2}
                onChange={(e) => setSpo2(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500 focus:outline-none text-center font-bold text-teal-700"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-slate-600 font-sans font-semibold mb-1">Respiratory Rate (/min)</label>
              <input
                type="number"
                required
                value={respRate}
                onChange={(e) => setRespRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500 focus:outline-none text-center font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Recording Clinician / Nurse</label>
            <input
              type="text"
              required
              value={nurseName}
              onChange={(e) => setNurseName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save to EHR Flowsheet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
