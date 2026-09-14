import React, { useState } from 'react';
import { X, UserPlus, HeartPulse, Shield, User, BedDouble } from 'lucide-react';
import { Patient, Doctor, Bed, BloodGroup, PatientCondition, PatientStatus } from '../types';

interface PatientAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  beds: Bed[];
  onAdmitPatient: (newPatient: Patient, assignedBedId?: string) => void;
}

export const PatientAdmissionModal: React.FC<PatientAdmissionModalProps> = ({
  isOpen,
  onClose,
  doctors,
  beds,
  onAdmitPatient,
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(35);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodType, setBloodType] = useState<BloodGroup>('O+');
  const [phone, setPhone] = useState('+1 (555) ');
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) ');

  const [status, setStatus] = useState<PatientStatus>('Inpatient');
  const [condition, setCondition] = useState<PatientCondition>('Stable');
  const [department, setDepartment] = useState('Cardiology');
  const [assignedDoctorId, setAssignedDoctorId] = useState(doctors[0]?.id || '');
  const [assignedBedId, setAssignedBedId] = useState('');

  const [diagnosis, setDiagnosis] = useState('');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('Blue Cross Shield');
  const [policyNumber, setPolicyNumber] = useState('BCS-' + Math.floor(10000 + Math.random() * 90000));
  const [coveragePercent, setCoveragePercent] = useState(80);
  const [notes, setNotes] = useState('');

  // Initial Vitals
  const [bp, setBp] = useState('120/80');
  const [heartRate, setHeartRate] = useState(75);
  const [temp, setTemp] = useState(36.8);
  const [spo2, setSpo2] = useState(98);
  const [respRate, setRespRate] = useState(16);

  if (!isOpen) return null;

  const availableBeds = beds.filter((b) => b.status === 'Available');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !diagnosis.trim()) {
      alert('Please enter patient name and clinical diagnosis.');
      return;
    }

    const assignedDoctor = doctors.find((d) => d.id === assignedDoctorId);
    const assignedBed = beds.find((b) => b.id === assignedBedId);

    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').slice(0, 16);

    const mrnNumber = 'MRN-' + Math.floor(10000 + Math.random() * 90000);
    const patientId = 'PT-' + Math.floor(1000 + Math.random() * 9000);

    const allergies = allergiesInput
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const newPatient: Patient = {
      id: patientId,
      medicalRecordNumber: mrnNumber,
      name,
      age: Number(age),
      gender,
      bloodType,
      phone,
      address: address || 'Springfield Metropolitan Area',
      emergencyContact: {
        name: emergencyName || 'Relative',
        relationship: emergencyRelationship,
        phone: emergencyPhone,
      },
      admissionDate: formattedDate,
      status,
      condition,
      department,
      assignedDoctorId: assignedDoctor?.id || 'DOC-01',
      assignedDoctorName: assignedDoctor?.name || 'Dr. Sarah Lin, MD',
      roomBed: assignedBed ? assignedBed.bedNumber : status === 'Inpatient' ? 'General Admission' : 'Outpatient Clinic',
      diagnosis,
      allergies: allergies.length > 0 ? allergies : ['No known drug allergies (NKDA)'],
      insurance: {
        provider: insuranceProvider,
        policyNumber,
        coveragePercent: Number(coveragePercent),
      },
      notes,
      vitalsHistory: [
        {
          id: 'VIT-' + Date.now(),
          bloodPressure: bp,
          heartRate: Number(heartRate),
          temperature: Number(temp),
          oxygenSaturation: Number(spo2),
          respiratoryRate: Number(respRate),
          recordedAt: formattedDate,
          recordedBy: 'Admission Triage Nurse',
        },
      ],
    };

    onAdmitPatient(newPatient, assignedBedId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
        <div className="bg-teal-700 text-white p-4 sm:p-5 flex items-center justify-between border-b border-teal-800">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5" />
            <div>
              <h2 className="text-base font-bold tracking-tight">New Patient Admission & Intake</h2>
              <p className="text-xs text-teal-100">
                Register Electronic Health Record (EHR) and allocate clinical department
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-teal-200 hover:text-white hover:bg-teal-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Section 1: Demographics */}
          <div>
            <h3 className="font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5 text-[11px]">
              <User className="w-3.5 h-3.5 text-teal-600" />
              1. Patient Demographics & Identification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Katherine Pierce"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Age</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Blood Group</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white font-mono"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Marcus Pierce"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Relationship</label>
                <input
                  type="text"
                  placeholder="e.g. Spouse / Sibling"
                  value={emergencyRelationship}
                  onChange={(e) => setEmergencyRelationship(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Emergency Phone</label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Admission & Physician Assignment */}
          <div className="pt-3 border-t border-slate-200">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5 text-[11px]">
              <BedDouble className="w-3.5 h-3.5 text-indigo-600" />
              2. Clinical Service, Doctor & Bed Allocation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Admission Type</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PatientStatus)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                >
                  <option value="Inpatient">Inpatient (Ward Stay)</option>
                  <option value="Outpatient">Outpatient (Clinic)</option>
                  <option value="Emergency">Emergency Intake</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Clinical Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as PatientCondition)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                >
                  <option value="Stable">Stable</option>
                  <option value="Guarded">Guarded</option>
                  <option value="Critical">Critical</option>
                  <option value="Recovering">Recovering</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Attending Physician</label>
                <select
                  value={assignedDoctorId}
                  onChange={(e) => {
                    setAssignedDoctorId(e.target.value);
                    const doc = doctors.find((d) => d.id === e.target.value);
                    if (doc) setDepartment(doc.department);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                >
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Assign Bed (Available)</label>
                <select
                  value={assignedBedId}
                  onChange={(e) => setAssignedBedId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white font-mono"
                >
                  <option value="">-- No Bed Assigned --</option>
                  {availableBeds.map((bed) => (
                    <option key={bed.id} value={bed.id}>
                      {bed.bedNumber} ({bed.ward})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-slate-600 font-semibold mb-1">Primary Diagnosis *</label>
              <input
                type="text"
                required
                placeholder="e.g. Acute exacerbation of chronic obstructive pulmonary disease (COPD)"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
              />
            </div>

            <div className="mt-3">
              <label className="block text-slate-600 font-semibold mb-1">
                Allergies (comma-separated, or 'None known')
              </label>
              <input
                type="text"
                placeholder="e.g. Penicillin, Shellfish, Latex"
                value={allergiesInput}
                onChange={(e) => setAllergiesInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Section 3: Baseline Intake Vitals */}
          <div className="pt-3 border-t border-slate-200">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5 text-[11px]">
              <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
              3. Baseline Intake Vital Signs
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
              <div>
                <label className="block text-slate-600 font-sans font-semibold mb-1">BP (mmHg)</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 text-center"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-sans font-semibold mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 text-center"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-sans font-semibold mb-1">Temp (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 text-center"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-sans font-semibold mb-1">SpO2 (%)</label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 text-center"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-sans font-semibold mb-1">Resp Rate (/min)</label>
                <input
                  type="number"
                  value={respRate}
                  onChange={(e) => setRespRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 text-center"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Insurance & Clinical Notes */}
          <div className="pt-3 border-t border-slate-200">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-teal-600" />
              4. Insurance & Clinical Admission Instructions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Insurance Provider</label>
                <input
                  type="text"
                  value={insuranceProvider}
                  onChange={(e) => setInsuranceProvider(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Policy Number</label>
                <input
                  type="text"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Coverage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={coveragePercent}
                  onChange={(e) => setCoveragePercent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-slate-600 font-semibold mb-1">Admission Clinical Notes</label>
              <textarea
                rows={2}
                placeholder="Initial physician instructions, special diet, isolation precautions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Complete Patient Admission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
