import React from 'react';
import {
  Users,
  BedDouble,
  HeartPulse,
  Stethoscope,
  CalendarCheck,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  Pill,
  FlaskConical,
  Activity,
  Plus,
} from 'lucide-react';
import {
  Patient,
  Doctor,
  Bed,
  Appointment,
  EmergencyCase,
  PharmacyItem,
  LabTest,
  Prescription,
  Invoice,
} from '../types';

interface DashboardOverviewProps {
  patients?: Patient[];
  doctors?: Doctor[];
  beds?: Bed[];
  appointments?: Appointment[];
  triageCases?: EmergencyCase[];
  emergencyCases?: EmergencyCase[];
  prescriptions?: Prescription[];
  pharmacy?: PharmacyItem[];
  labs?: LabTest[];
  invoices?: Invoice[];
  onSelectPatient?: (patientId: string) => void;
  onNavigateTab?: (tab: any) => void;
  onNavigate?: (tab: any) => void;
  onOpenAdmitModal?: () => void;
  onOpenAppointmentModal?: () => void;
  onOpenTriageModal?: () => void;
  onOpenLabModal?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  patients = [],
  doctors = [],
  beds = [],
  appointments = [],
  triageCases = [],
  emergencyCases = [],
  pharmacy = [],
  labs = [],
  onSelectPatient = (_patientId?: string) => {},
  onNavigateTab,
  onNavigate,
  onOpenAdmitModal = () => {},
  onOpenAppointmentModal = () => {},
  onOpenTriageModal = () => {},
  onOpenLabModal = () => {},
}) => {
  const navigate = onNavigateTab || onNavigate || (() => {});
  const safeTriage = triageCases && triageCases.length > 0 ? triageCases : (emergencyCases || []);

  const inpatients = (patients || []).filter((p) => p.status === 'Inpatient');
  const criticalPatients = (patients || []).filter(
    (p) => p.condition === 'Critical' || p.condition === 'Guarded'
  );
  const totalBeds = (beds || []).length;
  const occupiedBeds = (beds || []).filter((b) => b.status === 'Occupied').length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const lowStockMeds = (pharmacy || []).filter((item) => item.stockQuantity <= item.reorderLevel);
  const pendingLabs = (labs || []).filter((l) => l.status !== 'Completed');
  const activeTriage = safeTriage.filter((t) => t.status !== 'Admitted to Ward' && t.status !== 'Discharged');

  // Wards breakdown
  const wardTypes = Array.from(new Set((beds || []).map((b) => b.ward)));

  return (
    <div className="space-y-6">
      {/* Quick Clinical Operational Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Inpatient Census */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Inpatient Census
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{inpatients.length}</span>
            <span className="text-xs text-slate-500 font-medium">Admitted Patients</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Critical: <strong className="text-rose-600">{criticalPatients.length}</strong></span>
            <button
              onClick={() => navigate('patients')}
              className="text-teal-600 hover:text-teal-700 font-semibold inline-flex items-center gap-0.5 cursor-pointer"
            >
              View directory <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 2: Bed Occupancy */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Bed Capacity Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{occupancyRate}%</span>
            <span className="text-xs text-slate-500 font-medium">
              ({occupiedBeds}/{totalBeds} Beds Occupied)
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                occupancyRate > 80 ? 'bg-rose-500' : occupancyRate > 50 ? 'bg-amber-500' : 'bg-teal-500'
              }`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Emergency Triage Queue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              ER Triage Active
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{activeTriage.length}</span>
            <span className="text-xs text-slate-500 font-medium">Patients in Triage</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="text-rose-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              Trauma Bay Live
            </span>
            <button
              onClick={() => navigate('emergency')}
              className="text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-0.5 cursor-pointer"
            >
              Open ER Board <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 4: Doctors On Duty */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Clinical Roster
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {(doctors || []).filter((d) => d.availability === 'On Duty').length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              / {(doctors || []).length} Physicians On Duty
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>In Surgery: {(doctors || []).filter((d) => d.availability === 'In Surgery').length}</span>
            <button
              onClick={() => navigate('appointments')}
              className="text-teal-600 hover:text-teal-700 font-semibold inline-flex items-center gap-0.5 cursor-pointer"
            >
              Roster & Slots <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch Clinical Actions */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            Clinical Fast-Track Actions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immediate patient admissions, diagnostic test requests, and triage intake
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAdmitModal}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Admit Patient</span>
          </button>
          <button
            onClick={onOpenAppointmentModal}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Book Appointment</span>
          </button>
          <button
            onClick={onOpenLabModal}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
            <span>Order Lab Panel</span>
          </button>
          <button
            onClick={onOpenTriageModal}
            className="px-3 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Emergency Intake</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Critical Patients & Ward Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Critical Patients & Immediate Inpatients */}
        <div className="lg:col-span-2 space-y-6">
          {/* Critical Patients Watchlist */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-600" />
                  Critical & High-Acuity Patient Watchlist
                </h3>
                <p className="text-xs text-slate-500">
                  Patients requiring continuous hemodynamic monitoring and specialized rounds
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {criticalPatients.length} High Priority
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {criticalPatients.map((patient) => {
                const latestVital = patient.vitalsHistory[0];
                return (
                  <div
                    key={patient.id}
                    className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-slate-900">{patient.name}</span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {patient.medicalRecordNumber}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          {patient.condition}
                        </span>
                        <span className="text-[10px] font-mono font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {patient.roomBed}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 max-w-xl">
                        {patient.diagnosis}
                      </p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3">
                        <span>Attending: <strong className="text-slate-600">{patient.assignedDoctorName}</strong></span>
                        <span>•</span>
                        <span>Dept: <strong className="text-slate-600">{patient.department}</strong></span>
                      </div>
                    </div>

                    {/* Vitals snapshot */}
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                      {latestVital && (
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-right">
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">Latest Vitals</div>
                          <div className="text-xs font-mono font-bold text-slate-800">
                            BP: {latestVital.bloodPressure} | HR: {latestVital.heartRate} bpm
                          </div>
                          <div className="text-[11px] font-mono text-slate-600">
                            SpO2: {latestVital.oxygenSaturation}% | Temp: {latestVital.temperature}°C
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => onSelectPatient(patient.id)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
                      >
                        Open EHR
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Consultations & Appointments */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-teal-600" />
                  Scheduled Doctor Consultations
                </h3>
                <p className="text-xs text-slate-500">
                  Daily patient appointments across medical and surgical departments
                </p>
              </div>
              <button
                onClick={() => navigate('appointments')}
                className="text-xs text-teal-700 font-semibold hover:underline cursor-pointer"
              >
                View full schedule
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {appointments.slice(0, 4).map((apt) => (
                <div key={apt.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-center py-1 rounded-lg bg-slate-100 border border-slate-200">
                      <span className="block text-xs font-bold text-slate-800">{apt.time}</span>
                      <span className="block text-[9px] text-slate-500 uppercase">{apt.type.slice(0, 4)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900">{apt.patientName}</span>
                        <span className="text-[11px] text-slate-400">with</span>
                        <span className="text-xs font-medium text-teal-800">{apt.doctorName}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{apt.reason}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      apt.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : apt.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Ward Occupancy, Pharmacy Stock & Labs */}
        <div className="space-y-6">
          {/* Ward Bed Occupancy Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-indigo-600" />
                Ward Bed Breakdown
              </h3>
              <button
                onClick={() => navigate('wards')}
                className="text-xs text-teal-600 font-semibold hover:underline cursor-pointer"
              >
                Manage Beds
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {wardTypes.map((ward) => {
                const wardBeds = (beds || []).filter((b) => b.ward === ward);
                const wardOccupied = wardBeds.filter((b) => b.status === 'Occupied').length;
                const percentage = wardBeds.length > 0 ? Math.round((wardOccupied / wardBeds.length) * 100) : 0;

                return (
                  <div key={ward} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span className="truncate pr-2">{ward}</span>
                      <span className="font-mono text-slate-500 whitespace-nowrap">
                        {wardOccupied} / {wardBeds.length} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          percentage >= 90
                            ? 'bg-rose-500'
                            : percentage >= 60
                            ? 'bg-amber-500'
                            : 'bg-teal-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pharmacy Low-Stock & Safety Alerts */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-4 h-4 text-amber-600" />
                Pharmacy & Inventory Alerts
              </h3>
              <button
                onClick={() => navigate('pharmacy')}
                className="text-xs text-teal-600 font-semibold hover:underline cursor-pointer"
              >
                View Meds
              </button>
            </div>

            {lowStockMeds.length > 0 ? (
              <div className="space-y-2 mt-2">
                {lowStockMeds.map((med) => (
                  <div
                    key={med.id}
                    className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-amber-900 block">{med.name}</span>
                      <span className="text-[11px] text-amber-700">
                        Category: {med.category} • Reorder threshold: {med.reorderLevel} {med.unit}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-rose-700 block">
                        {med.stockQuantity} {med.unit}
                      </span>
                      <span className="text-[10px] text-rose-600 uppercase font-bold">Low Stock</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-2">All essential pharmaceuticals well-stocked.</p>
            )}
          </div>

          {/* Pending Laboratory Panels */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-indigo-600" />
                Pending Diagnostics ({pendingLabs.length})
              </h3>
              <button
                onClick={() => navigate('laboratory')}
                className="text-xs text-teal-600 font-semibold hover:underline cursor-pointer"
              >
                Lab Queue
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {pendingLabs.slice(0, 3).map((lab) => (
                <div key={lab.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block">{lab.testName}</span>
                    <span className="text-[11px] text-slate-500">
                      Patient: {lab.patientName} • Code: {lab.testCode}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      lab.priority.includes('STAT')
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {lab.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
