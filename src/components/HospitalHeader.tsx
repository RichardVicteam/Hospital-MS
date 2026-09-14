import React, { useState, useEffect } from 'react';
import {
  Activity,
  UserPlus,
  CalendarPlus,
  FlaskConical,
  Flame,
  Search,
  RefreshCw,
  Bell,
  Clock,
  Building2,
  Stethoscope,
  ChevronDown,
} from 'lucide-react';
import { Patient, Bed, EmergencyCase, Doctor } from '../types';

interface HospitalHeaderProps {
  patients?: Patient[];
  beds?: Bed[];
  doctors?: Doctor[];
  triageCases?: EmergencyCase[];
  emergencyCases?: EmergencyCase[];
  patientsCount?: number;
  criticalCount?: number;
  emergencyCount?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenAdmitModal?: () => void;
  onOpenAppointmentModal?: () => void;
  onOpenLabModal?: () => void;
  onOpenTriageModal?: () => void;
  onSelectPatient?: (patientId: string) => void;
  onResetData?: () => void;
}

export const HospitalHeader: React.FC<HospitalHeaderProps> = ({
  patients = [],
  beds = [],
  doctors = [],
  triageCases = [],
  emergencyCases,
  patientsCount,
  criticalCount,
  emergencyCount,
  searchQuery = '',
  onSearchChange = (_query?: string) => {},
  onOpenAdmitModal = () => {},
  onOpenAppointmentModal = () => {},
  onOpenLabModal = () => {},
  onOpenTriageModal = () => {},
  onSelectPatient = (_patientId?: string) => {},
  onResetData = () => {},
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showQuickActions, setShowQuickActions] = useState<boolean>(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const effectiveTriage = triageCases.length > 0 ? triageCases : (emergencyCases || []);
  const safePatients = patients || [];
  const safeBeds = beds || [];
  const safeDoctors = doctors || [];

  const totalInpatients = patientsCount ?? safePatients.filter((p) => p.status === 'Inpatient').length;
  const icuBeds = safeBeds.filter((b) => b?.ward && b.ward.includes('ICU'));
  const icuOccupied = icuBeds.filter((b) => b.status === 'Occupied').length;
  const activeDoctors = safeDoctors.filter((d) => d.availability === 'On Duty').length;
  const criticalTriage = criticalCount ?? effectiveTriage.filter(
    (c) => (typeof c.acuity === 'string' && (c.acuity.includes('Level 1') || c.acuity.includes('Level 2')))
  ).length;

  const filteredPatients = searchQuery?.trim() && Array.isArray(safePatients)
    ? safePatients
        .filter(
          (p) =>
            p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.medicalRecordNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.roomBed?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Clinical Alert Ticker */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Clinical Ops: Operational
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">
            Inpatient Census: <strong className="text-white">{totalInpatients}</strong>
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">
            ICU Occupancy: <strong className="text-white">{icuOccupied}/{icuBeds.length}</strong> Beds
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">
            Physicians On Duty: <strong className="text-white">{activeDoctors}/{doctors.length}</strong>
          </span>
          {criticalTriage > 0 && (
            <span className="inline-flex items-center gap-1 text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded text-[11px] font-semibold border border-rose-800/60">
              <Flame className="w-3 h-3 text-rose-400 animate-pulse" />
              ER Triage Alert: {criticalTriage} Critical Intake
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {currentDate} • {currentTime}
          </span>
          <button
            onClick={() => {
              if (confirm('Reset hospital database to default demonstration records?')) {
                onResetData();
              }
            }}
            title="Reset to default sample hospital data"
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Primary Brand & Actions Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Hospital Branding */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm ring-4 ring-teal-50">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  St. Jude Metropolitan
                </h1>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  Level 1 Trauma
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Integrated Hospital Management & Clinical EHR System
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full md:w-96">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search patients by name, MRN, room, or condition..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Quick Search Autocomplete Results */}
          {showSearchDropdown && filteredPatients.length > 0 && (
            <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="p-2 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Patients ({filteredPatients.length})
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => {
                      onSelectPatient(patient.id);
                      setShowSearchDropdown(false);
                      onSearchChange('');
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-50 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-800">{patient.name}</span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {patient.medicalRecordNumber}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            patient.condition === 'Critical'
                              ? 'bg-rose-100 text-rose-700'
                              : patient.condition === 'Guarded'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {patient.condition}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                        {patient.diagnosis}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {patient.roomBed}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="relative">
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Quick Action</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showQuickActions && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowQuickActions(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden">
                  <button
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenAdmitModal();
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-800 flex items-center gap-2.5 font-medium transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-teal-600" />
                    <span>Admit Inpatient / Register</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenAppointmentModal();
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-800 flex items-center gap-2.5 font-medium transition-colors"
                  >
                    <CalendarPlus className="w-4 h-4 text-teal-600" />
                    <span>Schedule Appointment</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenLabModal();
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-800 flex items-center gap-2.5 font-medium transition-colors"
                  >
                    <FlaskConical className="w-4 h-4 text-teal-600" />
                    <span>Order Diagnostic Lab Test</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickActions(false);
                      onOpenTriageModal();
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2.5 font-medium transition-colors border-t border-slate-100"
                  >
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span>Emergency Triage Intake</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
