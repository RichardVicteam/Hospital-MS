import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BedDouble,
  Pill,
  FlaskConical,
  Flame,
  Receipt,
} from 'lucide-react';
import { TabType } from '../types';

export type { TabType };

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingPrescriptionsCount?: number;
  pendingRxCount?: number;
  activeTriageCount?: number;
  emergencyCount?: number;
  pendingLabsCount?: number;
  pendingLabCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  pendingPrescriptionsCount,
  pendingRxCount,
  activeTriageCount,
  emergencyCount,
  pendingLabsCount,
  pendingLabCount,
}) => {
  const rxBadge = pendingPrescriptionsCount ?? pendingRxCount ?? 0;
  const triageBadge = activeTriageCount ?? emergencyCount ?? 0;
  const labBadge = pendingLabsCount ?? pendingLabCount ?? 0;

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Overview & Census', icon: LayoutDashboard },
    { id: 'patients' as TabType, label: 'Patients & EHR', icon: Users },
    { id: 'appointments' as TabType, label: 'Doctors & Appointments', icon: CalendarCheck },
    { id: 'wards' as TabType, label: 'Wards & Bed Capacity', icon: BedDouble },
    {
      id: 'pharmacy' as TabType,
      label: 'Pharmacy & Prescriptions',
      icon: Pill,
      badge: rxBadge > 0 ? rxBadge : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'laboratory' as TabType,
      label: 'Diagnostics & Labs',
      icon: FlaskConical,
      badge: labBadge > 0 ? labBadge : null,
      badgeColor: 'bg-indigo-500 text-white',
    },
    {
      id: 'emergency' as TabType,
      label: 'Emergency ER Triage',
      icon: Flame,
      badge: triageBadge > 0 ? triageBadge : null,
      badgeColor: 'bg-rose-600 text-white animate-pulse',
    },
    { id: 'billing' as TabType, label: 'Billing & Insurance', icon: Receipt },
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-[97px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              activeTab === tab.id ||
              (tab.id === 'emergency' && activeTab === 'triage') ||
              (tab.id === 'triage' && activeTab === 'emergency');
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge !== null && tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      tab.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
