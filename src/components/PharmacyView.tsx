import React, { useState } from 'react';
import {
  Pill,
  CheckCircle2,
  AlertTriangle,
  Package,
  Plus,
  Search,
  Filter,
  RefreshCw,
  ShieldAlert,
  ArrowDownToLine,
  X,
} from 'lucide-react';
import { Prescription, PharmacyItem, Patient, Doctor } from '../types';

interface PharmacyViewProps {
  prescriptions: Prescription[];
  pharmacy: PharmacyItem[];
  patients: Patient[];
  doctors: Doctor[];
  onDispensePrescription: (rxId: string) => void;
  onAddPrescription: (newRx: Prescription) => void;
  onRestockItem: (itemId: string, quantity: number) => void;
  onAddPharmacyItem: (newItem: PharmacyItem) => void;
  onSelectPatient: (patientId: string) => void;
}

export const PharmacyView: React.FC<PharmacyViewProps> = ({
  prescriptions = [],
  pharmacy = [],
  patients = [],
  doctors = [],
  onDispensePrescription,
  onAddPrescription,
  onRestockItem,
  onAddPharmacyItem,
  onSelectPatient,
}) => {
  const [activeSubView, setActiveSubView] = useState<'prescriptions' | 'inventory'>('prescriptions');
  const [rxStatusFilter, setRxStatusFilter] = useState<string>('All');
  const [inventoryCategory, setInventoryCategory] = useState<string>('All');
  const [inventorySearch, setInventorySearch] = useState<string>('');

  const safePrescriptions = prescriptions || [];
  const safePharmacy = pharmacy || [];
  const safePatients = patients || [];
  const safeDoctors = doctors || [];

  // New Prescription Modal
  const [isNewRxOpen, setIsNewRxOpen] = useState<boolean>(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(safePatients[0]?.id || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(safeDoctors[0]?.id || '');
  const [medicationName, setMedicationName] = useState<string>(safePharmacy[0]?.name || '');
  const [dosage, setDosage] = useState<string>('500mg');
  const [frequency, setFrequency] = useState<string>('Twice daily after meals');
  const [duration, setDuration] = useState<string>('7 days');
  const [instructions, setInstructions] = useState<string>('Complete full course of antibiotics.');

  // New Drug Modal
  const [isNewDrugOpen, setIsNewDrugOpen] = useState<boolean>(false);
  const [newDrugName, setNewDrugName] = useState('');
  const [newGenericName, setNewGenericName] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Antibiotics');
  const [newStock, setNewStock] = useState(100);
  const [newUnit, setNewUnit] = useState('Tablets');
  const [newReorder, setNewReorder] = useState(50);
  const [newPrice, setNewPrice] = useState(5.00);

  const pendingCount = safePrescriptions.filter((p) => p.status === 'Pending Dispense').length;
  const lowStockCount = safePharmacy.filter((item) => item.stockQuantity <= item.reorderLevel).length;

  const filteredRx = safePrescriptions.filter((rx) => {
    return rxStatusFilter === 'All' || rx.status === rxStatusFilter;
  });

  const filteredInventory = safePharmacy.filter((item) => {
    const matchesCat = inventoryCategory === 'All' || item.category === inventoryCategory;
    const matchesSearch =
      (item.name || '').toLowerCase().includes(inventorySearch.toLowerCase()) ||
      (item.genericName || '').toLowerCase().includes(inventorySearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Allergy safety check for selected patient and medication
  const currentPatient = safePatients.find((p) => p.id === selectedPatientId);
  const hasAllergyWarning =
    currentPatient &&
    (currentPatient.allergies || []).some((allergy) =>
      medicationName.toLowerCase().includes(allergy.toLowerCase())
    );

  const handleCreateRx = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === selectedPatientId);
    const doctor = doctors.find((d) => d.id === selectedDoctorId);
    if (!patient || !doctor) return;

    const newRx: Prescription = {
      id: 'RX-' + Math.floor(1000 + Math.random() * 9000),
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      doctorId: doctor.id,
      doctorName: doctor.name,
      medicationName,
      dosage,
      frequency,
      duration,
      prescribedDate: new Date().toISOString().slice(0, 10),
      status: 'Pending Dispense',
      instructions,
      allergiesWarning: hasAllergyWarning
        ? `SAFETY WARNING: Patient has listed allergy: ${currentPatient?.allergies.join(', ')}`
        : undefined,
    };

    onAddPrescription(newRx);
    setIsNewRxOpen(false);
  };

  const handleCreateDrug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrugName) return;

    const newItem: PharmacyItem = {
      id: 'MED-' + Math.floor(10 + Math.random() * 90),
      name: newDrugName,
      genericName: newGenericName || newDrugName,
      category: newCategory,
      stockQuantity: Number(newStock),
      unit: newUnit,
      reorderLevel: Number(newReorder),
      expiryDate: '2028-12-31',
      unitPrice: Number(newPrice),
    };

    onAddPharmacyItem(newItem);
    setIsNewDrugOpen(false);
    setNewDrugName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Pill className="w-5 h-5 text-amber-600" />
            Hospital Pharmacy & Medication Dispensary
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Electronic prescription fulfillment, pharmaceutical inventory, and cross-allergy validation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewRxOpen(true)}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Prescribe Medication</span>
          </button>
          <button
            onClick={() => setIsNewDrugOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4 text-slate-500" />
            <span>+ Add Formulary Item</span>
          </button>
        </div>
      </div>

      {/* Sub-view Switcher & Status Badges */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubView('prescriptions')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeSubView === 'prescriptions'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Active Prescription Queue ({pendingCount} Pending)
          </button>
          <button
            onClick={() => setActiveSubView('inventory')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeSubView === 'inventory'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Pharmaceutical Formulary & Stocks ({pharmacy.length} Drugs)
          </button>
        </div>

        {lowStockCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{lowStockCount} items below safety reorder threshold</span>
          </div>
        )}
      </div>

      {/* VIEW 1: PRESCRIPTIONS QUEUE */}
      {activeSubView === 'prescriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Filter Status:</span>
              <select
                value={rxStatusFilter}
                onChange={(e) => setRxStatusFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="All">All Prescriptions</option>
                <option value="Pending Dispense">Pending Dispense</option>
                <option value="Dispensed">Dispensed</option>
              </select>
            </div>

            <span className="text-slate-500 font-mono">
              {filteredRx.length} Prescriptions Listed
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Rx ID & Date</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Prescribed Medication</th>
                  <th className="py-3 px-4">Dosage & Instructions</th>
                  <th className="py-3 px-4">Prescribing Doctor</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRx.map((rx) => (
                  <tr key={rx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-slate-900 block">{rx.id}</span>
                      <span className="text-slate-400 text-[11px] block">{rx.prescribedDate}</span>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => onSelectPatient(rx.patientId)}
                        className="font-bold text-slate-900 hover:text-teal-600 block text-left"
                      >
                        {rx.patientName}
                      </button>
                      <span className="text-[10px] text-slate-400">{rx.patientAge} years old</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 text-xs">{rx.medicationName}</span>
                        {rx.allergiesWarning && (
                          <div className="flex items-center gap-1 text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-semibold">
                            <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />
                            <span>{rx.allergiesWarning}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-xs text-slate-700 font-medium">
                        {rx.dosage} • {rx.frequency} ({rx.duration})
                      </div>
                      <p className="text-[11px] text-slate-500 italic mt-0.5 truncate">{rx.instructions}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 text-xs block">{rx.doctorName}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                          rx.status === 'Dispensed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}
                      >
                        {rx.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {rx.status === 'Pending Dispense' ? (
                        <button
                          onClick={() => onDispensePrescription(rx.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs inline-flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Dispense</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">
                          Dispensed: {rx.dispensedAt?.slice(5, 16) || 'Logged'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: PHARMACEUTICAL INVENTORY */}
      {activeSubView === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search medication or generic name..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Therapeutic Class:</span>
              <select
                value={inventoryCategory}
                onChange={(e) => setInventoryCategory(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="All">All Categories</option>
                <option value="Antibiotics">Antibiotics</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Analgesics">Analgesics</option>
                <option value="Emergency & IV">Emergency & IV</option>
                <option value="Respiratory">Respiratory</option>
                <option value="Endocrine">Endocrine</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Medication & Formulary</th>
                  <th className="py-3 px-4">Therapeutic Class</th>
                  <th className="py-3 px-4">Stock In-House</th>
                  <th className="py-3 px-4">Reorder Level</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredInventory.map((item) => {
                  const isLow = item.stockQuantity <= item.reorderLevel;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-sans">
                        <span className="font-bold text-slate-900 block text-xs">{item.name}</span>
                        <span className="text-[11px] text-slate-500 block">Generic: {item.genericName}</span>
                      </td>

                      <td className="py-3 px-4 font-sans">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-bold text-sm ${
                            isLow ? 'text-rose-600 font-bold' : 'text-slate-900'
                          }`}
                        >
                          {item.stockQuantity} {item.unit}
                        </span>
                        {isLow && (
                          <span className="block text-[9px] uppercase font-bold text-rose-600">
                            Below Reorder Limit!
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {item.reorderLevel} {item.unit}
                      </td>

                      <td className="py-3 px-4 text-slate-600">{item.expiryDate}</td>

                      <td className="py-3 px-4 font-bold text-slate-900">
                        ${item.unitPrice.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-right font-sans">
                        <button
                          onClick={() => onRestockItem(item.id, 50)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <RefreshCw className="w-3 h-3 text-slate-600" />
                          <span>+50 Restock</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Write New Prescription */}
      {isNewRxOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            <div className="bg-amber-600 text-white p-4 flex items-center justify-between border-b border-amber-700">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5" />
                <div>
                  <h3 className="text-sm font-bold">Write Electronic Prescription</h3>
                  <p className="text-xs text-amber-100">Prescribe medication from hospital formulary</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewRxOpen(false)}
                className="p-1 text-amber-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRx} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-amber-500 bg-white"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.medicalRecordNumber}) - Allergies: {p.allergies.join(', ')}
                    </option>
                  ))}
                </select>
              </div>

              {hasAllergyWarning && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-800 text-xs font-semibold">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span>WARNING: Patient has listed allergy matching medication name!</span>
                    <p className="font-normal text-[11px] text-rose-700 mt-0.5">
                      Check clinical indications carefully before submitting.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Prescribing Doctor</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-amber-500 bg-white"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Medication Form</label>
                <select
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-amber-500 bg-white font-medium"
                >
                  {pharmacy.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name} (Stock: {item.stockQuantity} {item.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Dosage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500mg or 2 puffs"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7 days / 14 days"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Frequency</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Twice daily with food"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Clinical Instructions</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRxOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Issue Electronic Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Drug to Formulary */}
      {isNewDrugOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="text-sm font-bold">Add New Drug to Formulary</h3>
                  <p className="text-xs text-slate-400">Register medication item in pharmacy system</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewDrugOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDrug} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Medication Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Omeprazole 40mg Delayed-Release"
                  value={newDrugName}
                  onChange={(e) => setNewDrugName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Generic Name</label>
                <input
                  type="text"
                  placeholder="e.g. Omeprazole"
                  value={newGenericName}
                  onChange={(e) => setNewGenericName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500 bg-white"
                  >
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Analgesics">Analgesics</option>
                    <option value="Emergency & IV">Emergency & IV</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Endocrine">Endocrine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Unit Type</label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Reorder Level</label>
                  <input
                    type="number"
                    value={newReorder}
                    onChange={(e) => setNewReorder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewDrugOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Add to Formulary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
