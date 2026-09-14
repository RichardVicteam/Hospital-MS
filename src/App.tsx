import React, { useState, useEffect } from 'react';
import {
  Patient,
  Doctor,
  Appointment,
  Bed,
  Prescription,
  PharmacyItem,
  LabTest,
  Invoice,
  EmergencyCase,
  TabType,
  PatientVitals,
  AppointmentStatus,
  BedStatus,
  LabTestStatus,
  InvoiceStatus,
  TriageAcuity,
} from './types';
import { HospitalStorageService } from './services/hospitalDataService';

import { HospitalHeader } from './components/HospitalHeader';
import { NavigationTabs } from './components/NavigationTabs';
import { DashboardOverview } from './components/DashboardOverview';
import { PatientsView } from './components/PatientsView';
import { AppointmentsView } from './components/AppointmentsView';
import { WardsBedsView } from './components/WardsBedsView';
import { PharmacyView } from './components/PharmacyView';
import { LaboratoryView } from './components/LaboratoryView';
import { EmergencyTriageView } from './components/EmergencyTriageView';
import { BillingView } from './components/BillingView';

import { PatientDossierModal } from './components/PatientDossierModal';
import { PatientAdmissionModal } from './components/PatientAdmissionModal';
import { RecordVitalsModal } from './components/RecordVitalsModal';

import { AlertCircle, CheckCircle2, ShieldAlert, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Hospital Domain States
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [pharmacy, setPharmacy] = useState<PharmacyItem[]>([]);
  const [labs, setLabs] = useState<LabTest[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>([]);

  // Modal Triggers
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState<boolean>(false);
  const [vitalsPatient, setVitalsPatient] = useState<Patient | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ title: string; description: string; type: 'success' | 'alert' } | null>(null);

  const showToast = (title: string, description: string, type: 'success' | 'alert' = 'success') => {
    setToastMessage({ title, description, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Initial Load from Storage Service
  useEffect(() => {
    setPatients(HospitalStorageService.getPatients());
    setDoctors(HospitalStorageService.getDoctors());
    setAppointments(HospitalStorageService.getAppointments());
    setBeds(HospitalStorageService.getBeds());
    setPrescriptions(HospitalStorageService.getPrescriptions());
    setPharmacy(HospitalStorageService.getPharmacyItems());
    setLabs(HospitalStorageService.getLabTests());
    setInvoices(HospitalStorageService.getInvoices());
    setEmergencyCases(HospitalStorageService.getEmergencyCases());
  }, []);

  // --- Handlers ---

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const handleAdmitPatient = (newPatient: Patient, assignedBedId?: string) => {
    const updatedPatients = [newPatient, ...patients];
    setPatients(updatedPatients);
    HospitalStorageService.savePatients(updatedPatients);

    if (assignedBedId) {
      const updatedBeds = beds.map((b) =>
        b.id === assignedBedId
          ? {
              ...b,
              status: 'Occupied' as BedStatus,
              currentPatientId: newPatient.id,
              currentPatientName: newPatient.name,
              admissionDate: newPatient.admissionDate,
              assignedDoctor: newPatient.assignedDoctorName,
            }
          : b
      );
      setBeds(updatedBeds);
      HospitalStorageService.saveBeds(updatedBeds);
    }

    showToast(
      'Patient Admitted Successfully',
      `${newPatient.name} assigned MRN ${newPatient.medicalRecordNumber} in ${newPatient.department}.`
    );
  };

  const handleRecordVitals = (patientId: string, vitals: PatientVitals) => {
    const updatedPatients = patients.map((p) => {
      if (p.id === patientId) {
        return {
          ...p,
          vitalsHistory: [vitals, ...p.vitalsHistory],
        };
      }
      return p;
    });

    setPatients(updatedPatients);
    HospitalStorageService.savePatients(updatedPatients);
    showToast('Vital Signs Logged', `Recorded BP ${vitals.bloodPressure}, HR ${vitals.heartRate} bpm.`);
  };

  const handleDischargePatient = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const updatedPatients = patients.map((p) => {
      if (p.id === patientId) {
        return {
          ...p,
          status: 'Discharged' as any,
          roomBed: 'Discharged',
        };
      }
      return p;
    });
    setPatients(updatedPatients);
    HospitalStorageService.savePatients(updatedPatients);

    // Free any assigned bed
    const updatedBeds = beds.map((b) => {
      if (b.currentPatientId === patientId) {
        return {
          ...b,
          status: 'Cleaning' as BedStatus,
          currentPatientId: undefined,
          currentPatientName: undefined,
        };
      }
      return b;
    });
    setBeds(updatedBeds);
    HospitalStorageService.saveBeds(updatedBeds);

    showToast('Patient Discharged', `${patient.name} discharged. Bed scheduled for terminal cleaning.`);
  };

  const handleAddAppointment = (newApt: Appointment) => {
    const updated = [newApt, ...appointments];
    setAppointments(updated);
    HospitalStorageService.saveAppointments(updated);
    showToast('Appointment Scheduled', `Booked consultation with ${newApt.doctorName} on ${newApt.date}.`);
  };

  const handleUpdateAppointmentStatus = (aptId: string, status: AppointmentStatus) => {
    const updated = appointments.map((a) => (a.id === aptId ? { ...a, status } : a));
    setAppointments(updated);
    HospitalStorageService.saveAppointments(updated);
    showToast('Appointment Updated', `Consultation status changed to ${status}.`);
  };

  const handleUpdateBedStatus = (
    bedId: string,
    newStatus: BedStatus,
    patientId?: string,
    patientName?: string
  ) => {
    const updated = beds.map((b) => {
      if (b.id === bedId) {
        return {
          ...b,
          status: newStatus,
          currentPatientId: patientId,
          currentPatientName: patientName,
          admissionDate: newStatus === 'Occupied' ? new Date().toISOString().slice(0, 10) : undefined,
        };
      }
      return b;
    });

    setBeds(updated);
    HospitalStorageService.saveBeds(updated);

    if (patientId && newStatus === 'Occupied') {
      const bedObj = beds.find((b) => b.id === bedId);
      const bedLabel = bedObj ? bedObj.bedNumber : 'Ward Bed';
      const updatedPatients = patients.map((p) =>
        p.id === patientId ? { ...p, roomBed: bedLabel } : p
      );
      setPatients(updatedPatients);
      HospitalStorageService.savePatients(updatedPatients);
    }

    showToast('Bed Status Updated', `Bed status updated to ${newStatus}.`);
  };

  const handleDispensePrescription = (rxId: string) => {
    const rx = prescriptions.find((r) => r.id === rxId);
    if (!rx) return;

    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const updatedRx = prescriptions.map((r) =>
      r.id === rxId ? { ...r, status: 'Dispensed' as const, dispensedAt: now } : r
    );
    setPrescriptions(updatedRx);
    HospitalStorageService.savePrescriptions(updatedRx);

    // Decrement stock in pharmacy formulary
    const updatedPharm = pharmacy.map((item) => {
      if (rx.medicationName.toLowerCase().includes(item.name.toLowerCase().slice(0, 5))) {
        return {
          ...item,
          stockQuantity: Math.max(0, item.stockQuantity - 1),
        };
      }
      return item;
    });
    setPharmacy(updatedPharm);
    HospitalStorageService.savePharmacyItems(updatedPharm);

    showToast(
      'Medication Dispensed',
      `Dispensed ${rx.medicationName} for patient ${rx.patientName}.`
    );
  };

  const handleAddPrescription = (newRx: Prescription) => {
    const updated = [newRx, ...prescriptions];
    setPrescriptions(updated);
    HospitalStorageService.savePrescriptions(updated);
    showToast('Prescription Logged', `Electronic prescription for ${newRx.medicationName} sent to pharmacy.`);
  };

  const handleRestockPharmacy = (itemId: string, quantity: number) => {
    const updated = pharmacy.map((p) =>
      p.id === itemId ? { ...p, stockQuantity: p.stockQuantity + quantity } : p
    );
    setPharmacy(updated);
    HospitalStorageService.savePharmacyItems(updated);
    showToast('Inventory Restocked', `Replenished +${quantity} units to formulary inventory.`);
  };

  const handleAddPharmacyItem = (newItem: PharmacyItem) => {
    const updated = [newItem, ...pharmacy];
    setPharmacy(updated);
    HospitalStorageService.savePharmacyItems(updated);
    showToast('Formulary Updated', `Added ${newItem.name} to pharmacy catalogue.`);
  };

  const handleAddLabTest = (newTest: LabTest) => {
    const updated = [newTest, ...labs];
    setLabs(updated);
    HospitalStorageService.saveLabTests(updated);
    showToast('Lab Diagnostic Ordered', `Ordered ${newTest.testName} (${newTest.priority}).`);
  };

  const handleUpdateLabStatus = (testId: string, newStatus: LabTestStatus) => {
    const updated = labs.map((l) => (l.id === testId ? { ...l, status: newStatus } : l));
    setLabs(updated);
    HospitalStorageService.saveLabTests(updated);
    showToast('Lab Status Updated', `Investigation moved to stage: ${newStatus}.`);
  };

  const handleAddEmergencyCase = (newCase: EmergencyCase) => {
    const updated = [newCase, ...emergencyCases];
    setEmergencyCases(updated);
    HospitalStorageService.saveEmergencyCases(updated);
    showToast('ER Trauma Intake Logged', `Triage Level: ${newCase.acuity} - ${newCase.patientName}`, 'alert');
  };

  const handleUpdateEmergencyStatus = (caseId: string, newStatus: any) => {
    const updated = emergencyCases.map((ec) => (ec.id === caseId ? { ...ec, status: newStatus } : ec));
    setEmergencyCases(updated);
    HospitalStorageService.saveEmergencyCases(updated);
    showToast('ER Triage Disposition', `Case updated to ${newStatus}.`);
  };

  const handleAdmitEmergencyToWard = (emergencyCase: EmergencyCase, bedId: string) => {
    const bed = beds.find((b) => b.id === bedId);
    const bedLabel = bed ? bed.bedNumber : 'Ward Bed';

    const mrn = 'MRN-' + Math.floor(10000 + Math.random() * 90000);
    const newPatient: Patient = {
      id: 'PT-' + Math.floor(1000 + Math.random() * 9000),
      medicalRecordNumber: mrn,
      name: emergencyCase.patientName,
      age: emergencyCase.age,
      gender: emergencyCase.gender,
      bloodType: 'O+',
      phone: '+1 (555) 911-0000',
      address: 'Emergency Trauma Ingress',
      emergencyContact: {
        name: 'ER Next of Kin',
        relationship: 'Family',
        phone: '+1 (555) 911-0000',
      },
      admissionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Emergency',
      condition: emergencyCase.acuity.includes('Level 1') ? 'Critical' : 'Guarded',
      department: bed?.ward.includes('ICU') ? 'Intensive Care Unit (ICU)' : 'Emergency Medicine',
      assignedDoctorId: doctors[0]?.id || 'DOC-01',
      assignedDoctorName: doctors[0]?.name || 'Dr. Sarah Lin, MD',
      roomBed: bedLabel,
      diagnosis: emergencyCase.chiefComplaint,
      allergies: ['NKDA (No known drug allergies)'],
      insurance: {
        provider: 'Trauma Emergency Guarantee',
        policyNumber: 'ER-EMERGENCY',
        coveragePercent: 100,
      },
      notes: `Direct ER triage transfer. Vitals: BP ${emergencyCase.vitalsAtTriage.bp}, HR ${emergencyCase.vitalsAtTriage.pulse}.`,
      vitalsHistory: [
        {
          id: 'VIT-' + Date.now(),
          bloodPressure: emergencyCase.vitalsAtTriage.bp,
          heartRate: emergencyCase.vitalsAtTriage.pulse,
          temperature: 37.0,
          oxygenSaturation: emergencyCase.vitalsAtTriage.spo2,
          respiratoryRate: 20,
          recordedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          recordedBy: emergencyCase.triageNurse,
        },
      ],
    };

    handleAdmitPatient(newPatient, bedId);
    handleUpdateEmergencyStatus(emergencyCase.id, 'Admitted to Inpatient');
  };

  const handleAddInvoice = (newInvoice: Invoice) => {
    const updated = [newInvoice, ...invoices];
    setInvoices(updated);
    HospitalStorageService.saveInvoices(updated);
    showToast('Medical Invoice Generated', `Invoice ${newInvoice.id} generated for ${newInvoice.patientName}.`);
  };

  const handleUpdateInvoiceStatus = (invId: string, status: InvoiceStatus) => {
    const updated = invoices.map((inv) => (inv.id === invId ? { ...inv, status } : inv));
    setInvoices(updated);
    HospitalStorageService.saveInvoices(updated);
    showToast('Billing Updated', `Invoice marked as ${status}.`);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    const updated = patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p));
    setPatients(updated);
    HospitalStorageService.savePatients(updated);
    showToast('Patient Record Updated', `Saved EHR modifications for ${updatedPatient.name}.`);
  };

  const handleResetDemoData = () => {
    HospitalStorageService.resetAll();
    setPatients(HospitalStorageService.getPatients());
    setDoctors(HospitalStorageService.getDoctors());
    setAppointments(HospitalStorageService.getAppointments());
    setBeds(HospitalStorageService.getBeds());
    setPrescriptions(HospitalStorageService.getPrescriptions());
    setPharmacy(HospitalStorageService.getPharmacyItems());
    setLabs(HospitalStorageService.getLabTests());
    setInvoices(HospitalStorageService.getInvoices());
    setEmergencyCases(HospitalStorageService.getEmergencyCases());
    showToast('Database Reset', 'Default clinical demonstration records restored.');
  };

  // Active Critical/Emergency Patients count
  const criticalCount = patients.filter((p) => p.condition === 'Critical').length;
  const pendingRxCount = prescriptions.filter((p) => p.status === 'Pending Dispense').length;
  const pendingLabCount = labs.filter((l) => l.status !== 'Completed').length;
  const statErCount = emergencyCases.filter((ec) => ec.acuity.includes('Level 1') && ec.status !== 'Discharged').length;

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || null;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Real-time Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce-short">
          <div
            className={`p-4 rounded-2xl shadow-xl flex items-start gap-3 border text-xs max-w-sm ${
              toastMessage.type === 'alert'
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toastMessage.type === 'alert' ? (
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="font-bold text-white text-xs">{toastMessage.title}</h4>
              <p className="text-slate-300 text-[11px] mt-0.5">{toastMessage.description}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hospital Top Navigation Header */}
      <HospitalHeader
        patients={patients}
        beds={beds}
        doctors={doctors}
        triageCases={emergencyCases}
        emergencyCases={emergencyCases}
        patientsCount={patients.length}
        criticalCount={criticalCount}
        emergencyCount={emergencyCases.filter((e) => e.status !== 'Discharged').length}
        onOpenAdmitModal={() => setIsAdmitModalOpen(true)}
        onOpenAppointmentModal={() => setActiveTab('appointments')}
        onOpenLabModal={() => setActiveTab('laboratory')}
        onOpenTriageModal={() => setActiveTab('emergency')}
        onSelectPatient={handleSelectPatient}
        onResetData={handleResetDemoData}
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
      />

      {/* Critical Trauma Alert Notification Bar if Level 1 exists */}
      {statErCount > 0 && (
        <div className="bg-rose-600 text-white px-4 py-2 flex items-center justify-between text-xs font-semibold shadow-inner">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertCircle className="w-4 h-4 animate-ping" />
            <span>
              CODE RED TRAUMA ALERT: {statErCount} Level 1 Resuscitation patient(s) active in Emergency Department.
            </span>
            <button
              onClick={() => setActiveTab('emergency')}
              className="ml-auto underline font-bold hover:text-rose-100 cursor-pointer"
            >
              Go to Trauma Board →
            </button>
          </div>
        </div>
      )}

      {/* Main Clinical Workspace */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-5 flex-1 flex flex-col gap-5">
        {/* Navigation Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingPrescriptionsCount={pendingRxCount}
          pendingRxCount={pendingRxCount}
          pendingLabsCount={pendingLabCount}
          pendingLabCount={pendingLabCount}
          activeTriageCount={emergencyCases.filter((e) => e.status !== 'Discharged').length}
          emergencyCount={emergencyCases.filter((e) => e.status !== 'Discharged').length}
        />

        {/* Dynamic Module Content */}
        <div className="flex-1">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              patients={patients}
              doctors={doctors}
              appointments={appointments}
              beds={beds}
              triageCases={emergencyCases}
              emergencyCases={emergencyCases}
              prescriptions={prescriptions}
              pharmacy={pharmacy}
              labs={labs}
              invoices={invoices}
              onNavigate={setActiveTab}
              onNavigateTab={setActiveTab}
              onSelectPatient={handleSelectPatient}
              onOpenAdmitModal={() => setIsAdmitModalOpen(true)}
              onOpenAppointmentModal={() => setActiveTab('appointments')}
              onOpenTriageModal={() => setActiveTab('emergency')}
              onOpenLabModal={() => setActiveTab('laboratory')}
            />
          )}

          {activeTab === 'patients' && (
            <PatientsView
              patients={patients}
              onSelectPatient={handleSelectPatient}
              onOpenAdmitModal={() => setIsAdmitModalOpen(true)}
              onOpenRecordVitals={(pat) => setVitalsPatient(pat)}
              onDischargePatient={handleDischargePatient}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              doctors={doctors}
              patients={patients}
              onAddAppointment={handleAddAppointment}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onSelectPatient={handleSelectPatient}
            />
          )}

          {activeTab === 'wards' && (
            <WardsBedsView
              beds={beds}
              patients={patients}
              onUpdateBedStatus={handleUpdateBedStatus}
              onSelectPatient={handleSelectPatient}
            />
          )}

          {activeTab === 'pharmacy' && (
            <PharmacyView
              prescriptions={prescriptions}
              pharmacy={pharmacy}
              patients={patients}
              doctors={doctors}
              onDispensePrescription={handleDispensePrescription}
              onAddPrescription={handleAddPrescription}
              onRestockItem={handleRestockPharmacy}
              onAddPharmacyItem={handleAddPharmacyItem}
              onSelectPatient={handleSelectPatient}
            />
          )}

          {activeTab === 'laboratory' && (
            <LaboratoryView
              labs={labs}
              patients={patients}
              doctors={doctors}
              onAddLabTest={handleAddLabTest}
              onUpdateLabStatus={handleUpdateLabStatus}
              onSelectPatient={handleSelectPatient}
            />
          )}

          {(activeTab === 'emergency' || activeTab === 'triage') && (
            <EmergencyTriageView
              emergencyCases={emergencyCases}
              beds={beds}
              onAddEmergencyCase={handleAddEmergencyCase}
              onUpdateTriageStatus={handleUpdateEmergencyStatus}
              onAdmitEmergencyToWard={handleAdmitEmergencyToWard}
            />
          )}

          {activeTab === 'billing' && (
            <BillingView
              invoices={invoices}
              patients={patients}
              onAddInvoice={handleAddInvoice}
              onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
              onSelectPatient={handleSelectPatient}
            />
          )}
        </div>
      </main>

      {/* Patient Dossier EHR Modal */}
      <PatientDossierModal
        patient={selectedPatient}
        isOpen={!!selectedPatientId}
        onClose={() => setSelectedPatientId(null)}
        prescriptions={prescriptions}
        labs={labs}
        invoices={invoices}
        onUpdatePatient={handleUpdatePatient}
        onOpenRecordVitals={(pat) => setVitalsPatient(pat)}
        onOpenPrescribe={() => {
          setSelectedPatientId(null);
          setActiveTab('pharmacy');
        }}
        onOpenOrderLab={() => {
          setSelectedPatientId(null);
          setActiveTab('laboratory');
        }}
        onDispensePrescription={handleDispensePrescription}
      />

      {/* Patient Intake & Admission Modal */}
      <PatientAdmissionModal
        isOpen={isAdmitModalOpen}
        onClose={() => setIsAdmitModalOpen(false)}
        doctors={doctors}
        beds={beds}
        onAdmitPatient={handleAdmitPatient}
      />

      {/* Record Vitals Modal */}
      <RecordVitalsModal
        patient={vitalsPatient}
        isOpen={!!vitalsPatient}
        onClose={() => setVitalsPatient(null)}
        onSaveVitals={handleRecordVitals}
      />

      {/* Clinical Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold text-slate-700">MetroHealth Medical Center HMS v4.8</span>
            <span>• HIPAA & HL7 Fast Healthcare Interoperability Standard Compliant</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Active System Census: {patients.length} EHRs • Shift Leader: Dr. Sarah Lin, MD (Chief of Medicine)
          </div>
        </div>
      </footer>
    </div>
  );
}
