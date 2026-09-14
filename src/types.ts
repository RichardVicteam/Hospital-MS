export type PatientStatus = 'Inpatient' | 'Outpatient' | 'Emergency' | 'Discharged';
export type PatientCondition = 'Stable' | 'Critical' | 'Guarded' | 'Recovering';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type TabType =
  | 'dashboard'
  | 'patients'
  | 'appointments'
  | 'wards'
  | 'pharmacy'
  | 'laboratory'
  | 'emergency'
  | 'triage'
  | 'billing';

export interface PatientVitals {
  id: string;
  bloodPressure: string; // e.g. "120/80"
  heartRate: number; // bpm
  temperature: number; // °C
  oxygenSaturation: number; // %
  respiratoryRate: number; // bpm
  recordedAt: string;
  recordedBy: string;
}

export interface Patient {
  id: string;
  medicalRecordNumber: string; // e.g. "MRN-84920"
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodType: BloodGroup;
  phone: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  address: string;
  admissionDate: string;
  dischargeDate?: string;
  status: PatientStatus;
  condition: PatientCondition;
  department: string;
  assignedDoctorId: string;
  assignedDoctorName: string;
  roomBed: string; // e.g., "ICU-03" or "General-204"
  diagnosis: string;
  allergies: string[];
  vitalsHistory: PatientVitals[];
  insurance: {
    provider: string;
    policyNumber: string;
    coveragePercent: number;
  };
  notes: string;
}

export type DoctorAvailability = 'On Duty' | 'In Surgery' | 'On Call' | 'Off Duty';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  department: string;
  specialization: string;
  availability: DoctorAvailability;
  phone: string;
  email: string;
  experienceYears: number;
  roomNumber: string;
  totalPatientsAssigned: number;
}

export type AppointmentStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
export type AppointmentType =
  | 'Consultation'
  | 'Follow-up'
  | 'Diagnostic'
  | 'Surgical Review'
  | 'Emergency Triage'
  | 'Routine Checkup';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
}

export type BedStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
export type WardType =
  | 'Intensive Care Unit (ICU)'
  | 'Cardiology Ward'
  | 'General Ward'
  | 'Pediatric Care'
  | 'Surgical Recovery'
  | 'Maternity & Neonatal';

export interface Bed {
  id: string;
  ward: WardType;
  bedNumber: string;
  status: BedStatus;
  currentPatientId?: string;
  currentPatientName?: string;
  admissionDate?: string;
  assignedDoctor?: string;
  equipment: string[];
}

export type PrescriptionStatus = 'Pending Dispense' | 'Dispensed' | 'Completed' | 'Cancelled';

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  doctorId: string;
  doctorName: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedDate: string;
  status: PrescriptionStatus;
  instructions: string;
  dispensedAt?: string;
  allergiesWarning?: string;
}

export interface PharmacyItem {
  id: string;
  name: string;
  genericName: string;
  category: 'Antibiotics' | 'Cardiovascular' | 'Analgesics' | 'Emergency & IV' | 'Respiratory' | 'Endocrine';
  stockQuantity: number;
  unit: string;
  reorderLevel: number;
  expiryDate: string;
  unitPrice: number;
}

export type LabTestStatus = 'Ordered' | 'Sample Collected' | 'Analyzing' | 'Completed';

export interface LabResultItem {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: 'Normal' | 'High' | 'Low' | 'Critical';
}

export interface LabTest {
  id: string;
  testCode: string;
  patientId: string;
  patientName: string;
  orderedByDoctor: string;
  testName: string;
  category: 'Hematology' | 'Biochemistry' | 'Radiology' | 'Microbiology' | 'Cardiopulmonary';
  orderedDate: string;
  status: LabTestStatus;
  priority: 'Routine' | 'Urgent' | 'STAT (Emergency)';
  results?: LabResultItem[];
  pathologistNotes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category?: 'Room / Bed Charge' | 'Consultation' | 'Surgical Procedure' | 'Laboratory' | 'Pharmacy' | 'Emergency Fee' | string;
  department?: string;
  quantity?: number;
  unitCost?: number;
  totalCost?: number;
  amount: number;
}

export type InvoiceStatus = 'Paid' | 'Pending' | 'Pending Insurance' | 'Claim Processing' | 'Partial' | 'Overdue';

export interface Invoice {
  id: string;
  invoiceNumber?: string;
  patientId: string;
  patientName: string;
  patientMRN?: string;
  date?: string;
  issuedDate?: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal?: number;
  totalAmount: number;
  insuranceCovered: number;
  insuranceDiscount?: number;
  tax?: number;
  totalDue?: number;
  patientDue: number;
  status: InvoiceStatus;
  paymentMethod?: 'Insurance Direct' | 'Credit Card' | 'Wire Transfer' | 'Cash' | string;
  paidAt?: string;
  insuranceDetails?: {
    provider: string;
    policyNumber: string;
    claimNumber: string;
  };
}

export type TriageAcuity = 
  | 'Resuscitation - Level 1' 
  | 'Emergent - Level 2' 
  | 'Urgent - Level 3' 
  | 'Less Urgent - Level 4' 
  | 'Non-Urgent - Level 5';

export type TriageAcuityLevel =
  | TriageAcuity
  | 'Level 1: Resuscitation' 
  | 'Level 2: Emergent' 
  | 'Level 3: Urgent' 
  | 'Level 4: Less Urgent' 
  | 'Level 5: Non-Urgent';

export type EmergencyCaseStatus =
  | 'Triage'
  | 'Resuscitation'
  | 'In Treatment'
  | 'Waiting'
  | 'Physician Assessing'
  | 'Stabilized'
  | 'Admitted to Ward'
  | 'Admitted to Inpatient'
  | 'Discharged';

export interface EmergencyCase {
  id: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  acuity: TriageAcuity | TriageAcuityLevel | string;
  chiefComplaint: string;
  triageNurse: string;
  vitals?: {
    bp: string;
    pulse: number;
    spo2: number;
    temp?: number;
  };
  vitalsAtTriage?: {
    bp: string;
    pulse: number;
    spo2: number;
  };
  glasgowComaScale?: number;
  arrivedTime?: string;
  arrivedAt?: string;
  assignedBay?: string;
  status: EmergencyCaseStatus | string;
}
