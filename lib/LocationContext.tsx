'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ALL_INDIAN_STATES,
  getDistrictsForState,
  getDefaultDistrictForState,
} from './locations';

const STATE_STORAGE_KEY = 'krishimitra_selected_state';
const DISTRICT_STORAGE_KEY = 'krishimitra_selected_district';

interface LocationContextType {
  selectedState: string;
  selectedDistrict: string;
  setSelectedState: (state: string) => void;
  setSelectedDistrict: (district: string) => void;
  availableStates: string[];
  availableDistricts: string[];
  suggestLocationForLanguage: (lang: string) => void;
  isHydrated: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [selectedState, setSelectedStateState] = useState<string>('Karnataka');
  const [selectedDistrict, setSelectedDistrictState] = useState<string>('Belagavi');
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore saved state and district from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STATE_STORAGE_KEY);
      const savedDistrict = localStorage.getItem(DISTRICT_STORAGE_KEY);
      if (savedState && ALL_INDIAN_STATES.includes(savedState)) {
        setSelectedStateState(savedState);
        const validDistricts = getDistrictsForState(savedState);
        if (savedDistrict && validDistricts.includes(savedDistrict)) {
          setSelectedDistrictState(savedDistrict);
        } else {
          setSelectedDistrictState(validDistricts[0] || '');
        }
      }
    } catch {
      // ignore in restricted mode
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const setSelectedState = (newState: string) => {
    setSelectedStateState(newState);
    const districts = getDistrictsForState(newState);
    const newDist = districts.includes(selectedDistrict) ? selectedDistrict : districts[0] || '';
    setSelectedDistrictState(newDist);
    try {
      localStorage.setItem(STATE_STORAGE_KEY, newState);
      localStorage.setItem(DISTRICT_STORAGE_KEY, newDist);
    } catch {
      // ignore
    }
  };

  const setSelectedDistrict = (newDistrict: string) => {
    setSelectedDistrictState(newDistrict);
    try {
      localStorage.setItem(DISTRICT_STORAGE_KEY, newDistrict);
    } catch {
      // ignore
    }
  };

  // Called ONLY during initial onboarding recommendation if user hasn't explicitly set location
  const suggestLocationForLanguage = (lang: string) => {
    // Only suggest if not already saved in localStorage
    if (!localStorage.getItem(STATE_STORAGE_KEY)) {
      let state = 'Kerala';
      if (lang === 'kn') state = 'Karnataka';
      else if (lang === 'te') state = 'Andhra Pradesh';
      else if (lang === 'ta') state = 'Tamil Nadu';
      else if (lang === 'hi') state = 'Uttar Pradesh';
      else if (lang === 'ml') state = 'Kerala';
      const dist = getDefaultDistrictForState(state);
      setSelectedState(state);
      setSelectedDistrict(dist);
    }
  };

  const availableStates = ALL_INDIAN_STATES;
  const availableDistricts = getDistrictsForState(selectedState);

  return (
    <LocationContext.Provider
      value={{
        selectedState,
        selectedDistrict,
        setSelectedState,
        setSelectedDistrict,
        availableStates,
        availableDistricts,
        suggestLocationForLanguage,
        isHydrated,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
