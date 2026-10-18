'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ALL_INDIAN_STATES,
  getDistrictsForState,
  getDefaultDistrictForState,
  getStateForDistrict,
  isDistrictInState,
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

  // Restore saved state and district from localStorage with strict geographical validation
  useEffect(() => {
    try {
      let savedState = localStorage.getItem(STATE_STORAGE_KEY);
      let savedDistrict = localStorage.getItem(DISTRICT_STORAGE_KEY);

      // 1. Resolve geography if district and state mismatch (e.g. Wayanad in Karnataka)
      if (savedDistrict && savedState) {
        if (!isDistrictInState(savedDistrict, savedState)) {
          // If the district belongs to another valid state (e.g., Wayanad belongs to Kerala):
          // If savedState is Karnataka, correct the district to Belagavi!
          const realState = getStateForDistrict(savedDistrict);
          if (realState && savedState === 'Kerala') {
            // Keep Wayanad for Kerala
            savedDistrict = 'Wayanad';
          } else {
            // State is Karnataka or other, reset district to valid district of savedState
            savedDistrict = getDefaultDistrictForState(savedState);
          }
        }
      } else if (savedDistrict && !savedState) {
        // District saved without state: infer state from district
        savedState = getStateForDistrict(savedDistrict) || 'Karnataka';
      } else if (!savedState) {
        savedState = 'Karnataka';
        savedDistrict = 'Belagavi';
      }

      if (savedState && ALL_INDIAN_STATES.includes(savedState)) {
        const validDistricts = getDistrictsForState(savedState);
        const finalDistrict = (savedDistrict && validDistricts.includes(savedDistrict))
          ? savedDistrict
          : (validDistricts[0] || getDefaultDistrictForState(savedState));

        setSelectedStateState(savedState);
        setSelectedDistrictState(finalDistrict);
        localStorage.setItem(STATE_STORAGE_KEY, savedState);
        localStorage.setItem(DISTRICT_STORAGE_KEY, finalDistrict);
      }
    } catch {
      // ignore in restricted mode
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const setSelectedState = (newState: string) => {
    if (!ALL_INDIAN_STATES.includes(newState)) return;
    setSelectedStateState(newState);
    const districts = getDistrictsForState(newState);
    // If current selectedDistrict does not belong to the new state, immediately switch to the new state's default district!
    const newDist = isDistrictInState(selectedDistrict, newState)
      ? selectedDistrict
      : (districts[0] || getDefaultDistrictForState(newState));
    setSelectedDistrictState(newDist);
    try {
      localStorage.setItem(STATE_STORAGE_KEY, newState);
      localStorage.setItem(DISTRICT_STORAGE_KEY, newDist);
    } catch {
      // ignore
    }
  };

  const setSelectedDistrict = (newDistrict: string) => {
    if (!newDistrict) return;
    // If the district belongs to current selectedState, set it directly
    if (isDistrictInState(newDistrict, selectedState)) {
      setSelectedDistrictState(newDistrict);
      try {
        localStorage.setItem(DISTRICT_STORAGE_KEY, newDistrict);
      } catch {
        // ignore
      }
      return;
    }

    // If district belongs to another state (e.g. user selected Wayanad while state was Karnataka):
    const parentState = getStateForDistrict(newDistrict);
    if (parentState) {
      setSelectedStateState(parentState);
      setSelectedDistrictState(newDistrict);
      try {
        localStorage.setItem(STATE_STORAGE_KEY, parentState);
        localStorage.setItem(DISTRICT_STORAGE_KEY, newDistrict);
      } catch {
        // ignore
      }
    } else {
      const fallbackDist = getDefaultDistrictForState(selectedState);
      setSelectedDistrictState(fallbackDist);
      try {
        localStorage.setItem(DISTRICT_STORAGE_KEY, fallbackDist);
      } catch {
        // ignore
      }
    }
  };

  // Called ONLY during initial onboarding recommendation if user hasn't explicitly set location
  const suggestLocationForLanguage = (lang: string) => {
    // Only suggest if not already saved in localStorage
    if (!localStorage.getItem(STATE_STORAGE_KEY)) {
      let state = 'Karnataka';
      if (lang === 'kn') state = 'Karnataka';
      else if (lang === 'te') state = 'Andhra Pradesh';
      else if (lang === 'ta') state = 'Tamil Nadu';
      else if (lang === 'hi') state = 'Uttar Pradesh';
      else if (lang === 'ml') state = 'Kerala';
      else if (lang === 'en') state = 'Karnataka';
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
