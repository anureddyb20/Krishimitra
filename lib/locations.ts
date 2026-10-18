import { SupportedLanguage } from '@/types/i18n';

export interface StateLocationInfo {
  state: string;
  nativeStateName?: Record<string, string>;
  districts: string[];
}

export const INDIAN_STATES_DATA: Record<string, StateLocationInfo> = {
  'Karnataka': {
    state: 'Karnataka',
    nativeStateName: {
      kn: 'ಕರ್ನಾಟಕ',
      en: 'Karnataka',
    },
    districts: [
      'Mandya',
      'Mysuru',
      'Hassan',
      'Belagavi',
      'Shivamogga',
      'Dharwad',
      'Tumakuru',
      'Chikkamagaluru',
      'Davanagere',
      'Ballari',
      'Vijayapura',
      'Raichur',
      'Bengaluru Rural',
      'Kolar',
    ],
  },
  'Andhra Pradesh': {
    state: 'Andhra Pradesh',
    nativeStateName: {
      te: 'ఆంధ్రప్రదేశ్',
      en: 'Andhra Pradesh',
    },
    districts: [
      'Guntur',
      'Krishna',
      'East Godavari',
      'West Godavari',
      'Kurnool',
      'Anantapur',
      'Chittoor',
      'Prakasam',
      'Visakhapatnam',
      'Nellore',
      'Kadapa',
    ],
  },
  'Telangana': {
    state: 'Telangana',
    nativeStateName: {
      te: 'తెలంగాణ',
      en: 'Telangana',
    },
    districts: [
      'Warangal',
      'Karimnagar',
      'Nalgonda',
      'Nizamabad',
      'Khammam',
      'Mahabubnagar',
      'Sangareddy',
      'Adilabad',
      'Siddipet',
      'Rangareddy',
    ],
  },
  'Tamil Nadu': {
    state: 'Tamil Nadu',
    nativeStateName: {
      ta: 'தமிழ்நாடு',
      en: 'Tamil Nadu',
    },
    districts: [
      'Thanjavur',
      'Coimbatore',
      'Madurai',
      'Salem',
      'Erode',
      'Tiruchirappalli',
      'Dindigul',
      'Tirunelveli',
      'Vellore',
      'Tiruppur',
      'Cuddalore',
    ],
  },
  'Kerala': {
    state: 'Kerala',
    nativeStateName: {
      ml: 'കേരളം',
      en: 'Kerala',
    },
    districts: [
      'Wayanad',
      'Idukki',
      'Palakkad',
      'Alappuzha',
      'Kottayam',
      'Kozhikode',
      'Thrissur',
      'Ernakulam',
      'Malappuram',
      'Kannur',
      'Thiruvananthapuram',
      'Kollam',
      'Kasaragod',
      'Pathanamthitta',
    ],
  },
  'Uttar Pradesh': {
    state: 'Uttar Pradesh',
    nativeStateName: {
      hi: 'उत्तर प्रदेश',
      en: 'Uttar Pradesh',
    },
    districts: [
      'Varanasi',
      'Meerut',
      'Agra',
      'Prayagraj',
      'Gorakhpur',
      'Bareilly',
      'Aligarh',
      'Lucknow',
      'Ayodhya',
      'Moradabad',
    ],
  },
  'Madhya Pradesh': {
    state: 'Madhya Pradesh',
    nativeStateName: {
      hi: 'मध्य प्रदेश',
      en: 'Madhya Pradesh',
    },
    districts: [
      'Indore',
      'Ujjain',
      'Bhopal',
      'Jabalpur',
      'Gwalior',
      'Sagar',
      'Hoshangabad',
      'Dewas',
      'Satna',
    ],
  },
  'Rajasthan': {
    state: 'Rajasthan',
    nativeStateName: {
      hi: 'राजस्थान',
      en: 'Rajasthan',
    },
    districts: [
      'Jaipur',
      'Kota',
      'Jodhpur',
      'Sri Ganganagar',
      'Bikaner',
      'Alwar',
      'Udaipur',
      'Bharatpur',
    ],
  },
  'Punjab': {
    state: 'Punjab',
    nativeStateName: {
      hi: 'पंजाब',
      en: 'Punjab',
    },
    districts: [
      'Ludhiana',
      'Amritsar',
      'Jalandhar',
      'Patiala',
      'Bathinda',
      'Firozpur',
      'Sangrur',
      'Gurdaspur',
    ],
  },
  'Maharashtra': {
    state: 'Maharashtra',
    nativeStateName: {
      en: 'Maharashtra',
      hi: 'महाराष्ट्र',
    },
    districts: [
      'Nashik',
      'Pune',
      'Ahmednagar',
      'Kolhapur',
      'Solapur',
      'Nagpur',
      'Aurangabad (Chhatrapati Sambhajinagar)',
      'Jalgaon',
    ],
  },
  'Bihar': {
    state: 'Bihar',
    nativeStateName: {
      hi: 'बिहार',
      en: 'Bihar',
    },
    districts: [
      'Patna',
      'Muzaffarpur',
      'Gaya',
      'Bhagalpur',
      'Nalanda',
      'Samastipur',
      'Darbhanga',
    ],
  },
  'Haryana': {
    state: 'Haryana',
    nativeStateName: {
      hi: 'हरियाणा',
      en: 'Haryana',
    },
    districts: [
      'Karnal',
      'Hisar',
      'Ambala',
      'Rohtak',
      'Sirsa',
      'Kurukshetra',
      'Sonipat',
    ],
  },
  'Gujarat': {
    state: 'Gujarat',
    nativeStateName: {
      en: 'Gujarat',
      hi: 'गुजरात',
    },
    districts: [
      'Rajkot',
      'Surat',
      'Vadodara',
      'Mehsana',
      'Junagadh',
      'Anand',
      'Bhavnagar',
    ],
  },
};

export const ALL_INDIAN_STATES = Object.keys(INDIAN_STATES_DATA);

// Mapping from selected language to relevant states
export const LANGUAGE_STATES_MAP: Record<SupportedLanguage, string[]> = {
  kn: ['Karnataka'],
  te: ['Andhra Pradesh', 'Telangana'],
  ta: ['Tamil Nadu'],
  ml: ['Kerala'],
  hi: [
    'Uttar Pradesh',
    'Madhya Pradesh',
    'Rajasthan',
    'Punjab',
    'Haryana',
    'Bihar',
    'Maharashtra',
  ],
  en: ALL_INDIAN_STATES, // English allows selecting any Indian state!
};

export function getStatesForLanguage(lang: SupportedLanguage): string[] {
  return LANGUAGE_STATES_MAP[lang] || ALL_INDIAN_STATES;
}

export function getDefaultStateForLanguage(lang: SupportedLanguage): string {
  switch (lang) {
    case 'kn':
      return 'Karnataka';
    case 'te':
      return 'Andhra Pradesh';
    case 'ta':
      return 'Tamil Nadu';
    case 'ml':
      return 'Kerala';
    case 'hi':
      return 'Uttar Pradesh';
    case 'en':
    default:
      return 'Karnataka';
  }
}

export function getDistrictsForState(stateName: string): string[] {
  return INDIAN_STATES_DATA[stateName]?.districts || [];
}

export function getDefaultDistrictForState(stateName: string): string {
  const districts = getDistrictsForState(stateName);
  return districts[0] || (stateName === 'Kerala' ? 'Wayanad' : 'Mandya');
}
