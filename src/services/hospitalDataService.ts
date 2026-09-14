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
} from '../types';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'DOC-01',
    name: 'Dr. Sarah Lin, MD, FACC',
    title: 'Chief of Cardiology',
    department: 'Cardiology',
    specialization: 'Interventional Cardiology & Electrophysiology',
    availability: 'On Duty',
    phone: '+1 (555) 234-5678',
    email: 's.lin@stjudeshospital.org',
    experienceYears: 16,
    roomNumber: 'Cardio Suite 304',
    totalPatientsAssigned: 5,
  },
  {
    id: 'DOC-02',
    name: 'Dr. Marcus Vance, MD, FACS',
    title: 'Director of Trauma & Emergency',
    department: 'Emergency Medicine',
    specialization: 'Acute Trauma Care & Critical Resuscitation',
    availability: 'On Duty',
    phone: '+1 (555) 876-5432',
    email: 'm.vance@stjudeshospital.org',
    experienceYears: 19,
    roomNumber: 'ER Trauma Bay 1',
    totalPatientsAssigned: 8,
  },
  {
    id: 'DOC-03',
    name: 'Dr. Elena Rostova, MD, PhD',
    title: 'Senior Neurologist',
    department: 'Neurology',
    specialization: 'Stroke Intervention & Neurocritical Care',
    availability: 'In Surgery',
    phone: '+1 (555) 345-6789',
    email: 'e.rostova@stjudeshospital.org',
    experienceYears: 14,
    roomNumber: 'Neuro Suite 412',
    totalPatientsAssigned: 4,
  },
  {
    id: 'DOC-04',
    name: 'Dr. Julian Morales, MD, FAAP',
    title: 'Pediatric Specialist',
    department: 'Pediatrics',
    specialization: 'Neonatal & Pediatric Intensive Care',
    availability: 'On Duty',
    phone: '+1 (555) 456-7890',
    email: 'j.morales@stjudeshospital.org',
    experienceYears: 11,
    roomNumber: 'Peds Wing 105',
    totalPatientsAssigned: 6,
  },
  {
    id: 'DOC-05',
    name: 'Dr. Robert Chen, MD',
    title: 'Lead Orthopedic Surgeon',
    department: 'Orthopedics',
    specialization: 'Joint Reconstruction & Sports Traumatology',
    availability: 'On Call',
    phone: '+1 (555) 567-8901',
    email: 'r.chen@stjudeshospital.org',
    experienceYears: 15,
    roomNumber: 'Ortho Wing 210',
    totalPatientsAssigned: 3,
  },
  {
    id: 'DOC-06',
    name: 'Dr. Aisha Patel, MD',
    title: 'Consultant Pulmonologist',
    department: 'Internal Medicine',
    specialization: 'Respiratory Care & Infectious Diseases',
    availability: 'On Duty',
    phone: '+1 (555) 678-9012',
    email: 'a.patel@stjudeshospital.org',
    experienceYears: 9,
    roomNumber: 'Medical Suite 224',
    totalPatientsAssigned: 4,
  },
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'PT-8941',
    medicalRecordNumber: 'MRN-89410',
    name: 'Eleanor Davis',
    age: 64,
    gender: 'Female',
    bloodType: 'O+',
    phone: '+1 (555) 321-9988',
    emergencyContact: {
      name: 'Thomas Davis (Spouse)',
      relationship: 'Husband',
      phone: '+1 (555) 321-9989',
    },
    address: '428 Meadowbrook Lane, Springfield',
    admissionDate: '2026-09-11 08:30',
    status: 'Inpatient',
    condition: 'Guarded',
    department: 'Cardiology',
    assignedDoctorId: 'DOC-01',
    assignedDoctorName: 'Dr. Sarah Lin, MD, FACC',
    roomBed: 'ICU-02',
    diagnosis: 'Acute Coronary Syndrome (NSTEMI) post angioplasty stent placement',
    allergies: ['Penicillin', 'Sulfa drugs'],
    insurance: {
      provider: 'Blue Cross Shield Platinum',
      policyNumber: 'BCS-99214-01',
      coveragePercent: 85,
    },
    notes: 'Continuous telemetry active. Low sodium cardiac diet prescribed. Monitor cardiac enzymes 8-hourly.',
    vitalsHistory: [
      {
        id: 'VIT-1',
        bloodPressure: '138/86',
        heartRate: 78,
        temperature: 36.8,
        oxygenSaturation: 97,
        respiratoryRate: 16,
        recordedAt: '2026-09-14 06:00',
        recordedBy: 'Nurse Clara Brooks, RN',
      },
      {
        id: 'VIT-2',
        bloodPressure: '144/90',
        heartRate: 84,
        temperature: 37.1,
        oxygenSaturation: 96,
        respiratoryRate: 18,
        recordedAt: '2026-09-13 22:00',
        recordedBy: 'Nurse Clara Brooks, RN',
      },
      {
        id: 'VIT-3',
        bloodPressure: '152/94',
        heartRate: 92,
        temperature: 37.3,
        oxygenSaturation: 95,
        respiratoryRate: 20,
        recordedAt: '2026-09-13 14:00',
        recordedBy: 'Nurse Clara Brooks, RN',
      },
    ],
  },
  {
    id: 'PT-8942',
    medicalRecordNumber: 'MRN-89421',
    name: 'David K. Miller',
    age: 48,
    gender: 'Male',
    bloodType: 'A+',
    phone: '+1 (555) 745-1234',
    emergencyContact: {
      name: 'Claire Miller',
      relationship: 'Sister',
      phone: '+1 (555) 745-5678',
    },
    address: '1105 Cedar Heights Dr, Springfield',
    admissionDate: '2026-09-12 16:45',
    status: 'Inpatient',
    condition: 'Stable',
    department: 'Orthopedics',
    assignedDoctorId: 'DOC-05',
    assignedDoctorName: 'Dr. Robert Chen, MD',
    roomBed: 'SR-104',
    diagnosis: 'Closed fracture of right tibial shaft post internal fixation',
    allergies: ['Aspirin', 'Iodine contrast dye'],
    insurance: {
      provider: 'Aetna Health Care Advantage',
      policyNumber: 'AET-44321-99',
      coveragePercent: 80,
    },
    notes: 'Mobilization with physical therapy scheduled for today. Pain controlled via PCA pump.',
    vitalsHistory: [
      {
        id: 'VIT-4',
        bloodPressure: '122/78',
        heartRate: 72,
        temperature: 36.6,
        oxygenSaturation: 99,
        respiratoryRate: 15,
        recordedAt: '2026-09-14 07:00',
        recordedBy: 'Nurse Sam Tyler, RN',
      },
      {
        id: 'VIT-5',
        bloodPressure: '128/80',
        heartRate: 76,
        temperature: 36.9,
        oxygenSaturation: 98,
        respiratoryRate: 16,
        recordedAt: '2026-09-13 23:00',
        recordedBy: 'Nurse Sam Tyler, RN',
      },
    ],
  },
  {
    id: 'PT-8943',
    medicalRecordNumber: 'MRN-89433',
    name: 'Sophia Martinez',
    age: 7,
    gender: 'Female',
    bloodType: 'B+',
    phone: '+1 (555) 902-3344',
    emergencyContact: {
      name: 'Maria Martinez (Mother)',
      relationship: 'Mother',
      phone: '+1 (555) 902-3344',
    },
    address: '77 Whispering Pines Way, Springfield',
    admissionDate: '2026-09-13 11:20',
    status: 'Inpatient',
    condition: 'Recovering',
    department: 'Pediatrics',
    assignedDoctorId: 'DOC-04',
    assignedDoctorName: 'Dr. Julian Morales, MD, FAAP',
    roomBed: 'PED-201',
    diagnosis: 'Severe acute bacterial bronchitis with reactive airway distress',
    allergies: ['Peanuts'],
    insurance: {
      provider: 'UnitedHealthcare Community Plan',
      policyNumber: 'UHC-87123-04',
      coveragePercent: 95,
    },
    notes: 'Nebulized bronchodilator therapy q4h. Oxygen weaned to room air at 98%. Oral intake good.',
    vitalsHistory: [
      {
        id: 'VIT-6',
        bloodPressure: '102/64',
        heartRate: 98,
        temperature: 37.0,
        oxygenSaturation: 98,
        respiratoryRate: 22,
        recordedAt: '2026-09-14 06:30',
        recordedBy: 'Nurse Emily Zhang, BSN',
      },
      {
        id: 'VIT-7',
        bloodPressure: '106/68',
        heartRate: 110,
        temperature: 38.4,
        oxygenSaturation: 94,
        respiratoryRate: 28,
        recordedAt: '2026-09-13 18:00',
        recordedBy: 'Nurse Emily Zhang, BSN',
      },
    ],
  },
  {
    id: 'PT-8944',
    medicalRecordNumber: 'MRN-89447',
    name: 'James Arthur Wilson',
    age: 72,
    gender: 'Male',
    bloodType: 'AB-',
    phone: '+1 (555) 612-4411',
    emergencyContact: {
      name: 'Brenda Wilson (Daughter)',
      relationship: 'Daughter',
      phone: '+1 (555) 612-9900',
    },
    address: '89 Willow Lake Road, Springfield',
    admissionDate: '2026-09-14 01:15',
    status: 'Inpatient',
    condition: 'Critical',
    department: 'Neurology',
    assignedDoctorId: 'DOC-03',
    assignedDoctorName: 'Dr. Elena Rostova, MD, PhD',
    roomBed: 'ICU-01',
    diagnosis: 'Acute ischemic stroke (right MCA territory) - post mechanical thrombectomy',
    allergies: ['Latex'],
    insurance: {
      provider: 'Medicare Part A & B',
      policyNumber: 'MED-11029-45',
      coveragePercent: 80,
    },
    notes: 'Strict NIHSS neuro checks q1h. Target SBP < 140 mmHg. Keep head of bed elevated 30 degrees.',
    vitalsHistory: [
      {
        id: 'VIT-8',
        bloodPressure: '136/82',
        heartRate: 74,
        temperature: 37.2,
        oxygenSaturation: 98,
        respiratoryRate: 14,
        recordedAt: '2026-09-14 06:00',
        recordedBy: 'Nurse Clara Brooks, RN',
      },
      {
        id: 'VIT-9',
        bloodPressure: '168/98',
        heartRate: 88,
        temperature: 37.5,
        oxygenSaturation: 95,
        respiratoryRate: 18,
        recordedAt: '2026-09-14 02:00',
        recordedBy: 'Nurse Clara Brooks, RN',
      },
    ],
  },
  {
    id: 'PT-8945',
    medicalRecordNumber: 'MRN-89452',
    name: 'Amara Nnadi',
    age: 32,
    gender: 'Female',
    bloodType: 'O-',
    phone: '+1 (555) 432-8877',
    emergencyContact: {
      name: 'Kofi Nnadi',
      relationship: 'Brother',
      phone: '+1 (555) 432-8878',
    },
    address: '302 Elmwood Terrace, Springfield',
    admissionDate: '2026-09-14 08:00',
    status: 'Outpatient',
    condition: 'Stable',
    department: 'Internal Medicine',
    assignedDoctorId: 'DOC-06',
    assignedDoctorName: 'Dr. Aisha Patel, MD',
    roomBed: 'N/A (Clinic Visit)',
    diagnosis: 'Uncontrolled Type 2 Diabetes Mellitus with peripheral neuropathy evaluation',
    allergies: ['Codeine'],
    insurance: {
      provider: 'Cigna Health Plus',
      policyNumber: 'CIG-90432-11',
      coveragePercent: 90,
    },
    notes: 'HbA1c test requested. Insulin glargine dose adjustment consultation in progress.',
    vitalsHistory: [
      {
        id: 'VIT-10',
        bloodPressure: '128/82',
        heartRate: 76,
        temperature: 36.7,
        oxygenSaturation: 99,
        respiratoryRate: 16,
        recordedAt: '2026-09-14 08:15',
        recordedBy: 'Nurse Lisa Hall, LPN',
      },
    ],
  },
  {
    id: 'PT-8946',
    medicalRecordNumber: 'MRN-89460',
    name: 'George Henderson',
    age: 59,
    gender: 'Male',
    bloodType: 'A-',
    phone: '+1 (555) 819-2041',
    emergencyContact: {
      name: 'Mary Henderson',
      relationship: 'Wife',
      phone: '+1 (555) 819-2042',
    },
    address: '512 Oak Ridge Blvd, Springfield',
    admissionDate: '2026-09-08 14:00',
    dischargeDate: '2026-09-13 15:30',
    status: 'Discharged',
    condition: 'Recovering',
    department: 'General Surgery',
    assignedDoctorId: 'DOC-02',
    assignedDoctorName: 'Dr. Marcus Vance, MD, FACS',
    roomBed: 'Discharged',
    diagnosis: 'Laparoscopic cholecystectomy for acute cholecystitis - uncomplicated',
    allergies: ['None known'],
    insurance: {
      provider: 'Blue Cross Shield Platinum',
      policyNumber: 'BCS-33291-77',
      coveragePercent: 85,
    },
    notes: 'Follow-up appointment booked in surgical outpatient clinic in 10 days. Suture removal scheduled.',
    vitalsHistory: [
      {
        id: 'VIT-11',
        bloodPressure: '120/76',
        heartRate: 70,
        temperature: 36.5,
        oxygenSaturation: 99,
        respiratoryRate: 15,
        recordedAt: '2026-09-13 14:00',
        recordedBy: 'Nurse Sam Tyler, RN',
      },
    ],
  },
];

export const INITIAL_BEDS: Bed[] = [
  // ICU WARD
  {
    id: 'BED-ICU-01',
    ward: 'Intensive Care Unit (ICU)',
    bedNumber: 'ICU-01',
    status: 'Occupied',
    currentPatientId: 'PT-8944',
    currentPatientName: 'James Arthur Wilson',
    admissionDate: '2026-09-14 01:15',
    assignedDoctor: 'Dr. Elena Rostova, MD',
    equipment: ['Invasive Arterial Line', 'Mechanical Ventilator', 'Multiparameter Cardiac Monitor', 'Infusion Pump Array'],
  },
  {
    id: 'BED-ICU-02',
    ward: 'Intensive Care Unit (ICU)',
    bedNumber: 'ICU-02',
    status: 'Occupied',
    currentPatientId: 'PT-8941',
    currentPatientName: 'Eleanor Davis',
    admissionDate: '2026-09-11 08:30',
    assignedDoctor: 'Dr. Sarah Lin, MD',
    equipment: ['Telemetry Monitor', 'Oxygen Supply', 'Defibrillator Unit', 'IV Infusion Pump'],
  },
  {
    id: 'BED-ICU-03',
    ward: 'Intensive Care Unit (ICU)',
    bedNumber: 'ICU-03',
    status: 'Available',
    equipment: ['Ventilator Standby', 'Cardiac Monitor', 'Central Vacuum Suction'],
  },
  {
    id: 'BED-ICU-04',
    ward: 'Intensive Care Unit (ICU)',
    bedNumber: 'ICU-04',
    status: 'Cleaning',
    equipment: ['High-flow Oxygen Cannula', 'Patient Lifter', 'Cardiac Monitor'],
  },

  // CARDIOLOGY WARD
  {
    id: 'BED-CRD-101',
    ward: 'Cardiology Ward',
    bedNumber: 'CRD-101',
    status: 'Available',
    equipment: ['Telemetry Transmitter', 'Wall Oxygen Port', 'Emergency Call Beacon'],
  },
  {
    id: 'BED-CRD-102',
    ward: 'Cardiology Ward',
    bedNumber: 'CRD-102',
    status: 'Maintenance',
    equipment: ['ECG Cart Port', 'Adjustable Ortho-Mattress'],
  },

  // SURGICAL RECOVERY
  {
    id: 'BED-SR-104',
    ward: 'Surgical Recovery',
    bedNumber: 'SR-104',
    status: 'Occupied',
    currentPatientId: 'PT-8942',
    currentPatientName: 'David K. Miller',
    admissionDate: '2026-09-12 16:45',
    assignedDoctor: 'Dr. Robert Chen, MD',
    equipment: ['Sequential Compression Device (SCD)', 'PCA Pain Infuser', 'Pulse Oximeter'],
  },
  {
    id: 'BED-SR-105',
    ward: 'Surgical Recovery',
    bedNumber: 'SR-105',
    status: 'Available',
    equipment: ['Warming Blanket Unit', 'Wall Suction', 'Oxygen Flowmeter'],
  },

  // PEDIATRIC CARE
  {
    id: 'BED-PED-201',
    ward: 'Pediatric Care',
    bedNumber: 'PED-201',
    status: 'Occupied',
    currentPatientId: 'PT-8943',
    currentPatientName: 'Sophia Martinez',
    admissionDate: '2026-09-13 11:20',
    assignedDoctor: 'Dr. Julian Morales, MD',
    equipment: ['Pediatric Pulse Oximeter', 'Ultrasonic Nebulizer', 'Child Safe Rails'],
  },
  {
    id: 'BED-PED-202',
    ward: 'Pediatric Care',
    bedNumber: 'PED-202',
    status: 'Available',
    equipment: ['Infant Warmer System', 'Low-flow O2 Blender'],
  },

  // GENERAL WARD
  {
    id: 'BED-GW-301',
    ward: 'General Ward',
    bedNumber: 'GW-301',
    status: 'Available',
    equipment: ['Vital Signs Monitor', 'Oxygen Supply'],
  },
  {
    id: 'BED-GW-302',
    ward: 'General Ward',
    bedNumber: 'GW-302',
    status: 'Available',
    equipment: ['Vital Signs Monitor', 'IV Drip Pole'],
  },

  // MATERNITY
  {
    id: 'BED-MAT-401',
    ward: 'Maternity & Neonatal',
    bedNumber: 'MAT-401',
    status: 'Available',
    equipment: ['Fetal Heart Doppler', 'Baby Bassinet', 'Birthing Ergonomic Bed'],
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-501',
    patientId: 'PT-8945',
    patientName: 'Amara Nnadi',
    doctorId: 'DOC-06',
    doctorName: 'Dr. Aisha Patel, MD',
    department: 'Internal Medicine',
    date: '2026-09-14',
    time: '09:00',
    type: 'Consultation',
    status: 'In Progress',
    reason: 'Diabetic neuropathy evaluation and insulin titration review',
    notes: 'Check recent HbA1c result. Review glucose log book.',
  },
  {
    id: 'APT-502',
    patientId: 'PT-8941',
    patientName: 'Eleanor Davis',
    doctorId: 'DOC-01',
    doctorName: 'Dr. Sarah Lin, MD, FACC',
    department: 'Cardiology',
    date: '2026-09-14',
    time: '11:30',
    type: 'Diagnostic',
    status: 'Scheduled',
    reason: 'Post-stent echocardiogram and telemetry assessment',
  },
  {
    id: 'APT-503',
    patientId: 'PT-8942',
    patientName: 'David K. Miller',
    doctorId: 'DOC-05',
    doctorName: 'Dr. Robert Chen, MD',
    department: 'Orthopedics',
    date: '2026-09-14',
    time: '14:00',
    type: 'Surgical Review',
    status: 'Scheduled',
    reason: 'Post-op Day 2 wound check and weight bearing clearance',
  },
  {
    id: 'APT-504',
    patientId: 'PT-8943',
    patientName: 'Sophia Martinez',
    doctorId: 'DOC-04',
    doctorName: 'Dr. Julian Morales, MD, FAAP',
    department: 'Pediatrics',
    date: '2026-09-14',
    time: '15:30',
    type: 'Follow-up',
    status: 'Scheduled',
    reason: 'Bronchial auscultation and potential discharge approval',
  },
  {
    id: 'APT-505',
    patientId: 'PT-8946',
    patientName: 'George Henderson',
    doctorId: 'DOC-02',
    doctorName: 'Dr. Marcus Vance, MD, FACS',
    department: 'General Surgery',
    date: '2026-09-23',
    time: '10:00',
    type: 'Follow-up',
    status: 'Scheduled',
    reason: 'Post-cholecystectomy 2-week surgical follow-up',
  },
];

export const INITIAL_PHARMACY_ITEMS: PharmacyItem[] = [
  {
    id: 'MED-01',
    name: 'Atorvastatin Calcium 20mg',
    genericName: 'Atorvastatin',
    category: 'Cardiovascular',
    stockQuantity: 420,
    unit: 'Tablets',
    reorderLevel: 100,
    expiryDate: '2027-06-30',
    unitPrice: 1.45,
  },
  {
    id: 'MED-02',
    name: 'Amoxicillin / Clavulanate 875/125mg',
    genericName: 'Co-amoxiclav',
    category: 'Antibiotics',
    stockQuantity: 45, // Alert low stock
    unit: 'Tablets',
    reorderLevel: 80,
    expiryDate: '2027-02-15',
    unitPrice: 3.20,
  },
  {
    id: 'MED-03',
    name: 'Epinephrine Auto-Injector 0.3mg',
    genericName: 'Adrenaline',
    category: 'Emergency & IV',
    stockQuantity: 28,
    unit: 'Ampoules',
    reorderLevel: 25,
    expiryDate: '2026-12-31',
    unitPrice: 48.00,
  },
  {
    id: 'MED-04',
    name: 'Morphine Sulfate IV 10mg/mL',
    genericName: 'Morphine Sulfate',
    category: 'Analgesics',
    stockQuantity: 95,
    unit: 'Vials',
    reorderLevel: 50,
    expiryDate: '2027-11-20',
    unitPrice: 18.50,
  },
  {
    id: 'MED-05',
    name: 'Salbutamol Inhaler 100mcg',
    genericName: 'Albuterol Sulfate',
    category: 'Respiratory',
    stockQuantity: 110,
    unit: 'Inhalers',
    reorderLevel: 40,
    expiryDate: '2028-01-10',
    unitPrice: 14.75,
  },
  {
    id: 'MED-06',
    name: 'Insulin Glargine 100 Units/mL',
    genericName: 'Insulin Glargine',
    category: 'Endocrine',
    stockQuantity: 62,
    unit: 'Pens',
    reorderLevel: 30,
    expiryDate: '2027-04-18',
    unitPrice: 38.00,
  },
  {
    id: 'MED-07',
    name: 'Ceftriaxone IV 1g',
    genericName: 'Ceftriaxone Sodium',
    category: 'Antibiotics',
    stockQuantity: 180,
    unit: 'Vials',
    reorderLevel: 60,
    expiryDate: '2027-08-14',
    unitPrice: 9.80,
  },
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'RX-7701',
    patientId: 'PT-8941',
    patientName: 'Eleanor Davis',
    patientAge: 64,
    doctorId: 'DOC-01',
    doctorName: 'Dr. Sarah Lin, MD, FACC',
    medicationName: 'Atorvastatin Calcium 20mg',
    dosage: '20mg',
    frequency: 'Once daily at bedtime',
    duration: '30 days',
    prescribedDate: '2026-09-12',
    status: 'Dispensed',
    instructions: 'Take orally after evening meal. Lipid profile check in 4 weeks.',
    dispensedAt: '2026-09-12 14:10',
    allergiesWarning: 'Patient allergic to Penicillin. Verified safe.',
  },
  {
    id: 'RX-7702',
    patientId: 'PT-8942',
    patientName: 'David K. Miller',
    patientAge: 48,
    doctorId: 'DOC-05',
    doctorName: 'Dr. Robert Chen, MD',
    medicationName: 'Morphine Sulfate IV 10mg/mL',
    dosage: '2mg IV bolus q3h prn',
    frequency: 'As needed for severe surgical pain',
    duration: '3 days',
    prescribedDate: '2026-09-13',
    status: 'Dispensed',
    instructions: 'Administer via dedicated IV line. Monitor sedation score.',
    dispensedAt: '2026-09-13 09:20',
  },
  {
    id: 'RX-7703',
    patientId: 'PT-8943',
    patientName: 'Sophia Martinez',
    patientAge: 7,
    doctorId: 'DOC-04',
    doctorName: 'Dr. Julian Morales, MD, FAAP',
    medicationName: 'Salbutamol Inhaler 100mcg',
    dosage: '2 puffs with spacer',
    frequency: 'Every 4 hours',
    duration: '7 days',
    prescribedDate: '2026-09-13',
    status: 'Pending Dispense',
    instructions: 'Rinse mouth after administration. Assess lung sounds prior to dose.',
  },
  {
    id: 'RX-7704',
    patientId: 'PT-8945',
    patientName: 'Amara Nnadi',
    patientAge: 32,
    doctorId: 'DOC-06',
    doctorName: 'Dr. Aisha Patel, MD',
    medicationName: 'Insulin Glargine 100 Units/mL',
    dosage: '18 Units subcutaneous',
    frequency: 'Once daily at 21:00',
    duration: '90 days',
    prescribedDate: '2026-09-14',
    status: 'Pending Dispense',
    instructions: 'Rotate injection sites across abdomen. Store unpunctured pens refrigerated.',
  },
];

export const INITIAL_LAB_TESTS: LabTest[] = [
  {
    id: 'LAB-301',
    testCode: 'CBC-9901',
    patientId: 'PT-8941',
    patientName: 'Eleanor Davis',
    orderedByDoctor: 'Dr. Sarah Lin, MD, FACC',
    testName: 'Complete Blood Count with Differential (CBC)',
    category: 'Hematology',
    orderedDate: '2026-09-13 09:00',
    status: 'Completed',
    priority: 'Routine',
    pathologistNotes: 'Mild normocytic anemia noted; platelet count stable.',
    results: [
      { parameter: 'White Blood Cells (WBC)', value: '7.8', unit: 'x10^3/uL', referenceRange: '4.5 - 11.0', flag: 'Normal' },
      { parameter: 'Hemoglobin (Hgb)', value: '11.2', unit: 'g/dL', referenceRange: '12.0 - 15.5', flag: 'Low' },
      { parameter: 'Hematocrit (Hct)', value: '34.1', unit: '%', referenceRange: '37.0 - 48.0', flag: 'Low' },
      { parameter: 'Platelets', value: '245', unit: 'x10^3/uL', referenceRange: '150 - 450', flag: 'Normal' },
    ],
  },
  {
    id: 'LAB-302',
    testCode: 'CAR-4402',
    patientId: 'PT-8941',
    patientName: 'Eleanor Davis',
    orderedByDoctor: 'Dr. Sarah Lin, MD, FACC',
    testName: 'High Sensitivity Cardiac Troponin-I',
    category: 'Biochemistry',
    orderedDate: '2026-09-13 14:00',
    status: 'Completed',
    priority: 'Urgent',
    pathologistNotes: 'Troponin downward trending from peak 4.82 ng/mL following stent angioplasty.',
    results: [
      { parameter: 'Troponin I (hs-cTnI)', value: '0.42', unit: 'ng/mL', referenceRange: '< 0.04', flag: 'High' },
      { parameter: 'CK-MB', value: '5.1', unit: 'ng/mL', referenceRange: '0.0 - 4.9', flag: 'High' },
      { parameter: 'BNP (B-type Natriuretic)', value: '180', unit: 'pg/mL', referenceRange: '< 100', flag: 'High' },
    ],
  },
  {
    id: 'LAB-303',
    testCode: 'RAD-7719',
    patientId: 'PT-8944',
    patientName: 'James Arthur Wilson',
    orderedByDoctor: 'Dr. Elena Rostova, MD, PhD',
    testName: 'Brain MRI with Diffusion Weighted Imaging (DWI)',
    category: 'Radiology',
    orderedDate: '2026-09-14 02:30',
    status: 'Completed',
    priority: 'STAT (Emergency)',
    pathologistNotes: 'Successful recanalization of M1 segment with residual penumbra salvage. No hemorrhagic transformation.',
    results: [
      { parameter: 'ASPECTS Score', value: '8/10', unit: 'score', referenceRange: '8 - 10', flag: 'Normal' },
      { parameter: 'TICI Perfusion Grade', value: '2b/3', unit: 'grade', referenceRange: '2b - 3', flag: 'Normal' },
      { parameter: 'Intracranial Hemorrhage', value: 'Negative', unit: 'visual', referenceRange: 'Negative', flag: 'Normal' },
    ],
  },
  {
    id: 'LAB-304',
    testCode: 'MET-5581',
    patientId: 'PT-8945',
    patientName: 'Amara Nnadi',
    orderedByDoctor: 'Dr. Aisha Patel, MD',
    testName: 'Comprehensive Metabolic Panel & Glycated HbA1c',
    category: 'Biochemistry',
    orderedDate: '2026-09-14 08:30',
    status: 'Analyzing',
    priority: 'Routine',
  },
  {
    id: 'LAB-305',
    testCode: 'MIC-9920',
    patientId: 'PT-8943',
    patientName: 'Sophia Martinez',
    orderedByDoctor: 'Dr. Julian Morales, MD, FAAP',
    testName: 'Respiratory Pathogen PCR Panel',
    category: 'Microbiology',
    orderedDate: '2026-09-13 12:00',
    status: 'Sample Collected',
    priority: 'Urgent',
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-9001',
    invoiceNumber: 'INV-2026-09-001',
    patientId: 'PT-8946',
    patientName: 'George Henderson',
    patientMRN: 'MRN-84925',
    date: '2026-09-13',
    issuedDate: '2026-09-13',
    dueDate: '2026-10-13',
    items: [
      { id: 'ITM-1', description: 'Operating Room & Laparoscopic Equipment', category: 'Surgical Procedure', department: 'Surgical Suite', quantity: 1, unitCost: 4500.00, totalCost: 4500.00, amount: 4500.00 },
      { id: 'ITM-2', description: 'Surgical General Ward Accommodations (5 Nights)', category: 'Room / Bed Charge', department: 'General Ward', quantity: 5, unitCost: 650.00, totalCost: 3250.00, amount: 3250.00 },
      { id: 'ITM-3', description: 'Surgical Specialist Fee - Dr. Marcus Vance', category: 'Consultation', department: 'General Surgery', quantity: 1, unitCost: 1800.00, totalCost: 1800.00, amount: 1800.00 },
      { id: 'ITM-4', description: 'Post-op IV Antibiotics & Analgesics', category: 'Pharmacy', department: 'Pharmacy', quantity: 1, unitCost: 420.00, totalCost: 420.00, amount: 420.00 },
      { id: 'ITM-5', description: 'Pre-op Blood & Pathology Panel', category: 'Laboratory', department: 'Laboratory', quantity: 1, unitCost: 350.00, totalCost: 350.00, amount: 350.00 },
    ],
    subtotal: 10320.00,
    totalAmount: 10320.00,
    insuranceCovered: 8772.00,
    insuranceDiscount: 8772.00, // 85% covered
    tax: 0.00,
    totalDue: 1548.00,
    patientDue: 1548.00,
    status: 'Paid',
    paymentMethod: 'Credit Card',
    paidAt: '2026-09-13 16:00',
    insuranceDetails: {
      provider: 'Aetna Signature Health',
      policyNumber: 'AET-992014',
      claimNumber: 'CLM-784019',
    },
  },
  {
    id: 'INV-9002',
    invoiceNumber: 'INV-2026-09-002',
    patientId: 'PT-8941',
    patientName: 'Eleanor Davis',
    patientMRN: 'MRN-84920',
    date: '2026-09-14',
    issuedDate: '2026-09-14',
    dueDate: '2026-10-14',
    items: [
      { id: 'ITM-6', description: 'Cardiac Intensive Care Unit (ICU) - 3 Nights', category: 'Room / Bed Charge', department: 'ICU', quantity: 3, unitCost: 1850.00, totalCost: 5550.00, amount: 5550.00 },
      { id: 'ITM-7', description: 'Coronary Angioplasty & Drug-Eluting Stent', category: 'Surgical Procedure', department: 'Cath Lab', quantity: 1, unitCost: 12400.00, totalCost: 12400.00, amount: 12400.00 },
      { id: 'ITM-8', description: 'Continuous Telemetry & Nursing Care', category: 'Room / Bed Charge', department: 'Cardiology', quantity: 3, unitCost: 300.00, totalCost: 900.00, amount: 900.00 },
      { id: 'ITM-9', description: 'Cardiac Diagnostics & Serial Troponin', category: 'Laboratory', department: 'Laboratory', quantity: 1, unitCost: 680.00, totalCost: 680.00, amount: 680.00 },
    ],
    subtotal: 19530.00,
    totalAmount: 19530.00,
    insuranceCovered: 16600.50,
    insuranceDiscount: 16600.50, // 85%
    tax: 0.00,
    totalDue: 2929.50,
    patientDue: 2929.50,
    status: 'Claim Processing',
    insuranceDetails: {
      provider: 'Blue Cross Blue Shield PPO',
      policyNumber: 'BCBS-449210',
      claimNumber: 'CLM-339218',
    },
  },
  {
    id: 'INV-9003',
    invoiceNumber: 'INV-2026-09-003',
    patientId: 'PT-8945',
    patientName: 'Amara Nnadi',
    patientMRN: 'MRN-84924',
    date: '2026-09-14',
    issuedDate: '2026-09-14',
    dueDate: '2026-10-14',
    items: [
      { id: 'ITM-10', description: 'Specialist Outpatient Consultation', category: 'Consultation', department: 'Endocrinology', quantity: 1, unitCost: 220.00, totalCost: 220.00, amount: 220.00 },
      { id: 'ITM-11', description: 'Comprehensive Metabolic Panel & HbA1c', category: 'Laboratory', department: 'Laboratory', quantity: 1, unitCost: 140.00, totalCost: 140.00, amount: 140.00 },
    ],
    subtotal: 360.00,
    totalAmount: 360.00,
    insuranceCovered: 324.00,
    insuranceDiscount: 324.00,
    tax: 0.00,
    totalDue: 36.00,
    patientDue: 36.00,
    status: 'Pending Insurance',
    insuranceDetails: {
      provider: 'UnitedHealthcare Choice Plus',
      policyNumber: 'UHC-881290',
      claimNumber: 'CLM-559102',
    },
  },
];

export const INITIAL_TRIAGE_CASES: EmergencyCase[] = [
  {
    id: 'TRG-101',
    patientName: 'Julian Hayes',
    age: 52,
    gender: 'Male',
    acuity: 'Resuscitation - Level 1',
    chiefComplaint: 'Crushing retrosternal chest pain with diaphoresis, radiating to jaw. Hypotensive.',
    triageNurse: 'Nurse Brenda Cole, RN (Triage Lead)',
    vitals: {
      bp: '85/55',
      pulse: 122,
      spo2: 91,
      temp: 36.4,
    },
    vitalsAtTriage: {
      bp: '85/55',
      pulse: 122,
      spo2: 91,
    },
    glasgowComaScale: 14,
    arrivedTime: '08:45 AM',
    arrivedAt: '2026-09-14 08:45',
    assignedBay: 'Resuscitation Bay 1 (Red Zone)',
    status: 'Resuscitation',
  },
  {
    id: 'TRG-102',
    patientName: 'Maya Thorne',
    age: 26,
    gender: 'Female',
    acuity: 'Emergent - Level 2',
    chiefComplaint: 'Right lower quadrant abdominal pain with rebound tenderness and persistent vomiting.',
    triageNurse: 'Nurse Sam Tyler, RN',
    vitals: {
      bp: '115/72',
      pulse: 98,
      spo2: 99,
      temp: 38.6,
    },
    vitalsAtTriage: {
      bp: '115/72',
      pulse: 98,
      spo2: 99,
    },
    glasgowComaScale: 15,
    arrivedTime: '09:05 AM',
    arrivedAt: '2026-09-14 09:05',
    assignedBay: 'Acute Bay 4',
    status: 'In Treatment',
  },
  {
    id: 'TRG-103',
    patientName: 'Leonard Ross',
    age: 68,
    gender: 'Male',
    acuity: 'Urgent - Level 3',
    chiefComplaint: 'Acute exacerbation of COPD with moderate wheezing and exertional dyspnea.',
    triageNurse: 'Nurse Emily Zhang, BSN',
    vitals: {
      bp: '142/86',
      pulse: 88,
      spo2: 93,
      temp: 37.1,
    },
    vitalsAtTriage: {
      bp: '142/86',
      pulse: 88,
      spo2: 93,
    },
    glasgowComaScale: 15,
    arrivedTime: '09:20 AM',
    arrivedAt: '2026-09-14 09:20',
    assignedBay: 'Subacute Bay 2',
    status: 'In Treatment',
  },
];

const STORAGE_KEYS = {
  PATIENTS: 'hms_patients_v1',
  DOCTORS: 'hms_doctors_v1',
  BEDS: 'hms_beds_v1',
  APPOINTMENTS: 'hms_appointments_v1',
  PRESCRIPTIONS: 'hms_prescriptions_v1',
  PHARMACY: 'hms_pharmacy_v1',
  LABS: 'hms_labs_v1',
  INVOICES: 'hms_invoices_v1',
  TRIAGE: 'hms_triage_v1',
};

export class HospitalStorageService {
  static getPatients(): Patient[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return data ? JSON.parse(data) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  }

  static savePatients(patients: Patient[]): void {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }

  static getDoctors(): Doctor[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOCTORS);
      return data ? JSON.parse(data) : INITIAL_DOCTORS;
    } catch {
      return INITIAL_DOCTORS;
    }
  }

  static saveDoctors(doctors: Doctor[]): void {
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
  }

  static getBeds(): Bed[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BEDS);
      return data ? JSON.parse(data) : INITIAL_BEDS;
    } catch {
      return INITIAL_BEDS;
    }
  }

  static saveBeds(beds: Bed[]): void {
    localStorage.setItem(STORAGE_KEYS.BEDS, JSON.stringify(beds));
  }

  static getAppointments(): Appointment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return data ? JSON.parse(data) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  }

  static saveAppointments(apts: Appointment[]): void {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(apts));
  }

  static getPrescriptions(): Prescription[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
      return data ? JSON.parse(data) : INITIAL_PRESCRIPTIONS;
    } catch {
      return INITIAL_PRESCRIPTIONS;
    }
  }

  static savePrescriptions(rx: Prescription[]): void {
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(rx));
  }

  static getPharmacy(): PharmacyItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PHARMACY);
      return data ? JSON.parse(data) : INITIAL_PHARMACY_ITEMS;
    } catch {
      return INITIAL_PHARMACY_ITEMS;
    }
  }

  static getPharmacyItems(): PharmacyItem[] {
    return HospitalStorageService.getPharmacy();
  }

  static savePharmacy(items: PharmacyItem[]): void {
    localStorage.setItem(STORAGE_KEYS.PHARMACY, JSON.stringify(items));
  }

  static savePharmacyItems(items: PharmacyItem[]): void {
    HospitalStorageService.savePharmacy(items);
  }

  static getLabs(): LabTest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LABS);
      return data ? JSON.parse(data) : INITIAL_LAB_TESTS;
    } catch {
      return INITIAL_LAB_TESTS;
    }
  }

  static getLabTests(): LabTest[] {
    return HospitalStorageService.getLabs();
  }

  static saveLabs(labs: LabTest[]): void {
    localStorage.setItem(STORAGE_KEYS.LABS, JSON.stringify(labs));
  }

  static saveLabTests(labs: LabTest[]): void {
    HospitalStorageService.saveLabs(labs);
  }

  static getInvoices(): Invoice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return data ? JSON.parse(data) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  }

  static saveInvoices(invoices: Invoice[]): void {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }

  static getTriage(): EmergencyCase[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRIAGE);
      return data ? JSON.parse(data) : INITIAL_TRIAGE_CASES;
    } catch {
      return INITIAL_TRIAGE_CASES;
    }
  }

  static getEmergencyCases(): EmergencyCase[] {
    return HospitalStorageService.getTriage();
  }

  static saveTriage(cases: EmergencyCase[]): void {
    localStorage.setItem(STORAGE_KEYS.TRIAGE, JSON.stringify(cases));
  }

  static saveEmergencyCases(cases: EmergencyCase[]): void {
    HospitalStorageService.saveTriage(cases);
  }

  static resetAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  }
}
