'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import {
  getStatesForLanguage,
  getDefaultStateForLanguage,
  getDistrictsForState,
  getDefaultDistrictForState,
  ALL_INDIAN_STATES,
} from './locations';

interface LocationContextType {
  selectedState: string;
  selectedDistrict: string;
  setSelectedState: (state: string) => void;
  setSelectedDistrict: (district: string) => void;
  availableStates: string[];
  availableDistricts: string[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { language } = useTranslation();

  const [selectedState, setSelectedStateState] = useState<string>(() =>
    getDefaultStateForLanguage('kn')
  );
  const [selectedDistrict, setSelectedDistrictState] = useState<string>(() =>
    getDefaultDistrictForState('Karnataka')
  );

  // When language changes, update state and district accordingly
  useEffect(() => {
    const statesForLang = getStatesForLanguage(language);
    // If the currently selected state is not among the language's states, switch to default
    if (!statesForLang.includes(selectedState)) {
      const defaultState = getDefaultStateForLanguage(language);
      const defaultDist = getDefaultDistrictForState(defaultState);
      setSelectedStateState(defaultState);
      setSelectedDistrictState(defaultDist);
    }
  }, [language]);

  const setSelectedState = (newState: string) => {
    setSelectedStateState(newState);
    const districts = getDistrictsForState(newState);
    if (!districts.includes(selectedDistrict)) {
      setSelectedDistrictState(districts[0] || '');
    }
  };

  const setSelectedDistrict = (newDistrict: string) => {
    setSelectedDistrictState(newDistrict);
  };

  const availableStates = getStatesForLanguage(language);
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
