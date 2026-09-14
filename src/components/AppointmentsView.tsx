import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Clock,
  User,
  Stethoscope,
  Filter,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Calendar,
} from 'lucide-react';
import { Appointment, Doctor, Patient, AppointmentStatus, AppointmentType } from '../types';

interface AppointmentsViewProps {
  appointments: Appointment[];
  doctors: Doctor[];
  patients: Patient[];
  onAddAppointment: (appointment: Appointment) => void;
  onUpdateStatus: (appointmentId: string, status: AppointmentStatus) => void;
  onSelectPatient: (patientId: string) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments = [],
  doctors = [],
  patients = [],
  onAddAppointment,
  onUpdateStatus,
  onSelectPatient,
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // New Appointment Form State
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  const [date, setDate] = useState('2026-09-14');
  const [time, setTime] = useState('10:00');
  const [type, setType] = useState<AppointmentType>('Consultation');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const filtered = (appointments || []).filter((apt) => {
    const matchesDoc = selectedDoctorId === 'All' || apt.doctorId === selectedDoctorId;
    const matchesStatus = selectedStatus === 'All' || apt.status === selectedStatus;
    const matchesType = selectedType === 'All' || apt.type === selectedType;
    return matchesDoc && matchesStatus && matchesType;
  });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please enter consultation reason.');
      return;
    }

    const patient = patients.find((p) => p.id === patientId);
    const doctor = doctors.find((d) => d.id === doctorId);

    const newApt: Appointment = {
      id: 'APT-' + Math.floor(100 + Math.random() * 900),
      patientId,
      patientName: patient?.name || 'Unknown Patient',
      doctorId,
      doctorName: doctor?.name || 'Dr. Physician',
      department: doctor?.department || 'General Medicine',
      date,
      time,
      type,
      status: 'Scheduled',
      reason,
      notes,
    };

    onAddAppointment(newApt);
    setIsBookModalOpen(false);
    setReason('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-teal-600" />
            Physician Rosters & Consultation Scheduling
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage outpatient appointments, pre-op assessments, and multidisciplinary rounds
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Schedule Appointment</span>
        </button>
      </div>

      {/* Doctor Availability Grid */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-teal-600" />
          Active Physician Duty Board
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{doc.name}</h4>
                  <span className="text-[10px] text-teal-700 font-semibold block">{doc.title}</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${
                    doc.availability === 'On Duty'
                      ? 'bg-emerald-100 text-emerald-800'
                      : doc.availability === 'In Surgery'
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : doc.availability === 'On Call'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {doc.availability}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 space-y-0.5 pt-1 border-t border-slate-200/60">
                <div className="flex justify-between">
                  <span>Specialty:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[170px]">{doc.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span>Suite / Room:</span>
                  <span className="font-medium text-slate-700">{doc.roomNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Assigned Inpatients:</span>
                  <span className="font-bold text-slate-800">{doc.totalPatientsAssigned} active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Doctor:</span>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Physicians</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Consultation">Consultation</option>
              <option value="Diagnostic">Diagnostic</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Surgical Review">Surgical Review</option>
            </select>
          </div>
        </div>

        <span className="text-slate-500 font-medium font-mono">
          Showing {filtered.length} appointment slots
        </span>
      </div>

      {/* Appointment Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Date & Slot</th>
              <th className="py-3 px-4">Patient</th>
              <th className="py-3 px-4">Physician & Dept</th>
              <th className="py-3 px-4">Type & Clinical Reason</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-400">
                  No appointments match the selected filters.
                </td>
              </tr>
            ) : (
              filtered.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-slate-900 block">{apt.time}</span>
                    <span className="text-slate-500 text-[11px] block">{apt.date}</span>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => onSelectPatient(apt.patientId)}
                      className="font-bold text-slate-900 hover:text-teal-600 transition-colors block text-left"
                    >
                      {apt.patientName}
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {apt.patientId}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{apt.doctorName}</span>
                    <span className="text-[10px] text-teal-700 font-medium">{apt.department}</span>
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px] inline-block">
                        {apt.type}
                      </span>
                      <p className="text-slate-600 text-xs truncate">{apt.reason}</p>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        apt.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : apt.status === 'Cancelled'
                          ? 'bg-slate-200 text-slate-600 line-through'
                          : 'bg-teal-50 text-teal-800 border border-teal-200'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {apt.status === 'Scheduled' && (
                        <button
                          onClick={() => onUpdateStatus(apt.id, 'In Progress')}
                          title="Start Consultation"
                          className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 cursor-pointer"
                        >
                          <PlayCircle className="w-4 h-4" />
                        </button>
                      )}
                      {(apt.status === 'Scheduled' || apt.status === 'In Progress') && (
                        <button
                          onClick={() => onUpdateStatus(apt.id, 'Completed')}
                          title="Mark Consultation Completed"
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                        <button
                          onClick={() => onUpdateStatus(apt.id, 'Cancelled')}
                          title="Cancel Appointment"
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            <div className="bg-teal-700 text-white p-4 flex items-center justify-between border-b border-teal-800">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5" />
                <div>
                  <h3 className="text-sm font-bold">Schedule Doctor Consultation</h3>
                  <p className="text-xs text-teal-100">Create appointment slot on doctor calendar</p>
                </div>
              </div>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="p-1 text-teal-200 hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500 bg-white"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.medicalRecordNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Attending Physician</label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500 bg-white"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} - {d.department} ({d.availability})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Consultation Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Time Slot</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Appointment Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AppointmentType)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500 bg-white"
                >
                  <option value="Consultation">General Consultation</option>
                  <option value="Follow-up">Post-Treatment Follow-up</option>
                  <option value="Diagnostic">Diagnostic Evaluation</option>
                  <option value="Surgical Review">Pre/Post Surgical Review</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Clinical Indication / Reason *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hypertension management checkup and echocardiogram review"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Pre-Appointment Clinical Notes</label>
                <textarea
                  rows={2}
                  placeholder="Instructions for fasting, bringing recent imaging, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
