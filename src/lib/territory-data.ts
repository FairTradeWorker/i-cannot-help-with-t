export interface TerritoryZip {
  zip: string;
  city: string;
  state: string;
  county: string;
  latitude: number;
  longitude: number;
  population: number;
  medianIncome: number;
  timezone: string;
  countyFIPS: string;
  available: boolean;
  monthlyPrice: number;
}

// Territory data - comprehensive list of 1000+ zip codes (excluding CA, FL, NY)
// States covered: TX, AZ, GA, CO, TN, WA, OR, NV, UT, NM, OH, MI, IL, IN, NC, SC, VA, PA, MN, WI, MO, KS, OK, LA, AL, MS, AR, KY, WV, IA, NE, SD, ND, MT, WY, ID

interface CityData {
  name: string;
  county: string;
  baseLat: number;
  baseLng: number;
  zipPrefix: string;
  timezone: string;
  countyFIPS: string;
}

const stateData: Record<string, { cities: CityData[] }> = {
  TX: {
    cities: [
      { name: 'Austin', county: 'Travis', baseLat: 30.27, baseLng: -97.74, zipPrefix: '787', timezone: 'America/Chicago', countyFIPS: '48453' },
      { name: 'Houston', county: 'Harris', baseLat: 29.76, baseLng: -95.37, zipPrefix: '770', timezone: 'America/Chicago', countyFIPS: '48201' },
      { name: 'Dallas', county: 'Dallas', baseLat: 32.78, baseLng: -96.80, zipPrefix: '752', timezone: 'America/Chicago', countyFIPS: '48113' },
      { name: 'San Antonio', county: 'Bexar', baseLat: 29.42, baseLng: -98.49, zipPrefix: '782', timezone: 'America/Chicago', countyFIPS: '48029' },
      { name: 'Fort Worth', county: 'Tarrant', baseLat: 32.75, baseLng: -97.33, zipPrefix: '761', timezone: 'America/Chicago', countyFIPS: '48439' },
      { name: 'El Paso', county: 'El Paso', baseLat: 31.76, baseLng: -106.49, zipPrefix: '799', timezone: 'America/Denver', countyFIPS: '48141' },
      { name: 'Plano', county: 'Collin', baseLat: 33.02, baseLng: -96.70, zipPrefix: '750', timezone: 'America/Chicago', countyFIPS: '48085' },
      { name: 'Corpus Christi', county: 'Nueces', baseLat: 27.80, baseLng: -97.40, zipPrefix: '784', timezone: 'America/Chicago', countyFIPS: '48355' },
    ]
  },
  AZ: {
    cities: [
      { name: 'Phoenix', county: 'Maricopa', baseLat: 33.45, baseLng: -112.07, zipPrefix: '850', timezone: 'America/Phoenix', countyFIPS: '04013' },
      { name: 'Tucson', county: 'Pima', baseLat: 32.22, baseLng: -110.93, zipPrefix: '857', timezone: 'America/Phoenix', countyFIPS: '04019' },
      { name: 'Mesa', county: 'Maricopa', baseLat: 33.42, baseLng: -111.83, zipPrefix: '852', timezone: 'America/Phoenix', countyFIPS: '04013' },
      { name: 'Scottsdale', county: 'Maricopa', baseLat: 33.49, baseLng: -111.93, zipPrefix: '852', timezone: 'America/Phoenix', countyFIPS: '04013' },
      { name: 'Chandler', county: 'Maricopa', baseLat: 33.31, baseLng: -111.84, zipPrefix: '852', timezone: 'America/Phoenix', countyFIPS: '04013' },
      { name: 'Tempe', county: 'Maricopa', baseLat: 33.43, baseLng: -111.94, zipPrefix: '852', timezone: 'America/Phoenix', countyFIPS: '04013' },
    ]
  },
  GA: {
    cities: [
      { name: 'Atlanta', county: 'Fulton', baseLat: 33.75, baseLng: -84.39, zipPrefix: '303', timezone: 'America/New_York', countyFIPS: '13121' },
      { name: 'Savannah', county: 'Chatham', baseLat: 32.08, baseLng: -81.09, zipPrefix: '314', timezone: 'America/New_York', countyFIPS: '13051' },
      { name: 'Augusta', county: 'Richmond', baseLat: 33.47, baseLng: -81.97, zipPrefix: '309', timezone: 'America/New_York', countyFIPS: '13245' },
      { name: 'Columbus', county: 'Muscogee', baseLat: 32.46, baseLng: -84.99, zipPrefix: '319', timezone: 'America/New_York', countyFIPS: '13215' },
      { name: 'Macon', county: 'Bibb', baseLat: 32.84, baseLng: -83.63, zipPrefix: '312', timezone: 'America/New_York', countyFIPS: '13021' },
    ]
  },
  CO: {
    cities: [
      { name: 'Denver', county: 'Denver', baseLat: 39.74, baseLng: -104.99, zipPrefix: '802', timezone: 'America/Denver', countyFIPS: '08031' },
      { name: 'Colorado Springs', county: 'El Paso', baseLat: 38.83, baseLng: -104.82, zipPrefix: '809', timezone: 'America/Denver', countyFIPS: '08041' },
      { name: 'Aurora', county: 'Arapahoe', baseLat: 39.73, baseLng: -104.83, zipPrefix: '800', timezone: 'America/Denver', countyFIPS: '08005' },
      { name: 'Fort Collins', county: 'Larimer', baseLat: 40.59, baseLng: -105.08, zipPrefix: '805', timezone: 'America/Denver', countyFIPS: '08069' },
      { name: 'Boulder', county: 'Boulder', baseLat: 40.02, baseLng: -105.27, zipPrefix: '803', timezone: 'America/Denver', countyFIPS: '08013' },
    ]
  },
  TN: {
    cities: [
      { name: 'Nashville', county: 'Davidson', baseLat: 36.16, baseLng: -86.78, zipPrefix: '372', timezone: 'America/Chicago', countyFIPS: '47037' },
      { name: 'Memphis', county: 'Shelby', baseLat: 35.15, baseLng: -90.05, zipPrefix: '381', timezone: 'America/Chicago', countyFIPS: '47157' },
      { name: 'Knoxville', county: 'Knox', baseLat: 35.96, baseLng: -83.92, zipPrefix: '379', timezone: 'America/New_York', countyFIPS: '47093' },
      { name: 'Chattanooga', county: 'Hamilton', baseLat: 35.05, baseLng: -85.31, zipPrefix: '374', timezone: 'America/New_York', countyFIPS: '47065' },
      { name: 'Clarksville', county: 'Montgomery', baseLat: 36.53, baseLng: -87.36, zipPrefix: '370', timezone: 'America/Chicago', countyFIPS: '47125' },
    ]
  },
  WA: {
    cities: [
      { name: 'Seattle', county: 'King', baseLat: 47.61, baseLng: -122.33, zipPrefix: '981', timezone: 'America/Los_Angeles', countyFIPS: '53033' },
      { name: 'Spokane', county: 'Spokane', baseLat: 47.66, baseLng: -117.43, zipPrefix: '992', timezone: 'America/Los_Angeles', countyFIPS: '53063' },
      { name: 'Tacoma', county: 'Pierce', baseLat: 47.25, baseLng: -122.44, zipPrefix: '984', timezone: 'America/Los_Angeles', countyFIPS: '53053' },
      { name: 'Vancouver', county: 'Clark', baseLat: 45.64, baseLng: -122.66, zipPrefix: '986', timezone: 'America/Los_Angeles', countyFIPS: '53011' },
      { name: 'Bellevue', county: 'King', baseLat: 47.61, baseLng: -122.20, zipPrefix: '980', timezone: 'America/Los_Angeles', countyFIPS: '53033' },
    ]
  },
  OR: {
    cities: [
      { name: 'Portland', county: 'Multnomah', baseLat: 45.52, baseLng: -122.68, zipPrefix: '972', timezone: 'America/Los_Angeles', countyFIPS: '41051' },
      { name: 'Salem', county: 'Marion', baseLat: 44.94, baseLng: -123.03, zipPrefix: '973', timezone: 'America/Los_Angeles', countyFIPS: '41047' },
      { name: 'Eugene', county: 'Lane', baseLat: 44.05, baseLng: -123.09, zipPrefix: '974', timezone: 'America/Los_Angeles', countyFIPS: '41039' },
      { name: 'Bend', county: 'Deschutes', baseLat: 44.06, baseLng: -121.31, zipPrefix: '977', timezone: 'America/Los_Angeles', countyFIPS: '41017' },
    ]
  },
  NV: {
    cities: [
      { name: 'Las Vegas', county: 'Clark', baseLat: 36.17, baseLng: -115.14, zipPrefix: '891', timezone: 'America/Los_Angeles', countyFIPS: '32003' },
      { name: 'Henderson', county: 'Clark', baseLat: 36.04, baseLng: -114.98, zipPrefix: '890', timezone: 'America/Los_Angeles', countyFIPS: '32003' },
      { name: 'Reno', county: 'Washoe', baseLat: 39.53, baseLng: -119.81, zipPrefix: '895', timezone: 'America/Los_Angeles', countyFIPS: '32031' },
      { name: 'North Las Vegas', county: 'Clark', baseLat: 36.20, baseLng: -115.12, zipPrefix: '890', timezone: 'America/Los_Angeles', countyFIPS: '32003' },
    ]
  },
  UT: {
    cities: [
      { name: 'Salt Lake City', county: 'Salt Lake', baseLat: 40.76, baseLng: -111.89, zipPrefix: '841', timezone: 'America/Denver', countyFIPS: '49035' },
      { name: 'Provo', county: 'Utah', baseLat: 40.23, baseLng: -111.66, zipPrefix: '846', timezone: 'America/Denver', countyFIPS: '49049' },
      { name: 'West Valley City', county: 'Salt Lake', baseLat: 40.69, baseLng: -112.00, zipPrefix: '841', timezone: 'America/Denver', countyFIPS: '49035' },
      { name: 'Ogden', county: 'Weber', baseLat: 41.22, baseLng: -111.97, zipPrefix: '844', timezone: 'America/Denver', countyFIPS: '49057' },
    ]
  },
  NM: {
    cities: [
      { name: 'Albuquerque', county: 'Bernalillo', baseLat: 35.08, baseLng: -106.65, zipPrefix: '871', timezone: 'America/Denver', countyFIPS: '35001' },
      { name: 'Las Cruces', county: 'Dona Ana', baseLat: 32.35, baseLng: -106.76, zipPrefix: '880', timezone: 'America/Denver', countyFIPS: '35013' },
      { name: 'Santa Fe', county: 'Santa Fe', baseLat: 35.69, baseLng: -105.94, zipPrefix: '875', timezone: 'America/Denver', countyFIPS: '35049' },
    ]
  },
  OH: {
    cities: [
      { name: 'Columbus', county: 'Franklin', baseLat: 39.96, baseLng: -82.99, zipPrefix: '432', timezone: 'America/New_York', countyFIPS: '39049' },
      { name: 'Cleveland', county: 'Cuyahoga', baseLat: 41.50, baseLng: -81.69, zipPrefix: '441', timezone: 'America/New_York', countyFIPS: '39035' },
      { name: 'Cincinnati', county: 'Hamilton', baseLat: 39.10, baseLng: -84.51, zipPrefix: '452', timezone: 'America/New_York', countyFIPS: '39061' },
      { name: 'Toledo', county: 'Lucas', baseLat: 41.65, baseLng: -83.54, zipPrefix: '436', timezone: 'America/New_York', countyFIPS: '39095' },
      { name: 'Akron', county: 'Summit', baseLat: 41.08, baseLng: -81.52, zipPrefix: '443', timezone: 'America/New_York', countyFIPS: '39153' },
      { name: 'Dayton', county: 'Montgomery', baseLat: 39.76, baseLng: -84.19, zipPrefix: '454', timezone: 'America/New_York', countyFIPS: '39113' },
    ]
  },
  MI: {
    cities: [
      { name: 'Detroit', county: 'Wayne', baseLat: 42.33, baseLng: -83.05, zipPrefix: '482', timezone: 'America/Detroit', countyFIPS: '26163' },
      { name: 'Grand Rapids', county: 'Kent', baseLat: 42.96, baseLng: -85.66, zipPrefix: '495', timezone: 'America/Detroit', countyFIPS: '26081' },
      { name: 'Ann Arbor', county: 'Washtenaw', baseLat: 42.28, baseLng: -83.74, zipPrefix: '481', timezone: 'America/Detroit', countyFIPS: '26161' },
      { name: 'Lansing', county: 'Ingham', baseLat: 42.73, baseLng: -84.56, zipPrefix: '489', timezone: 'America/Detroit', countyFIPS: '26065' },
      { name: 'Flint', county: 'Genesee', baseLat: 43.01, baseLng: -83.69, zipPrefix: '485', timezone: 'America/Detroit', countyFIPS: '26049' },
    ]
  },
  IL: {
    cities: [
      { name: 'Chicago', county: 'Cook', baseLat: 41.88, baseLng: -87.63, zipPrefix: '606', timezone: 'America/Chicago', countyFIPS: '17031' },
      { name: 'Aurora', county: 'Kane', baseLat: 41.76, baseLng: -88.32, zipPrefix: '605', timezone: 'America/Chicago', countyFIPS: '17089' },
      { name: 'Naperville', county: 'DuPage', baseLat: 41.79, baseLng: -88.15, zipPrefix: '605', timezone: 'America/Chicago', countyFIPS: '17043' },
      { name: 'Rockford', county: 'Winnebago', baseLat: 42.27, baseLng: -89.09, zipPrefix: '611', timezone: 'America/Chicago', countyFIPS: '17201' },
      { name: 'Springfield', county: 'Sangamon', baseLat: 39.80, baseLng: -89.65, zipPrefix: '627', timezone: 'America/Chicago', countyFIPS: '17167' },
      { name: 'Peoria', county: 'Peoria', baseLat: 40.69, baseLng: -89.59, zipPrefix: '616', timezone: 'America/Chicago', countyFIPS: '17143' },
    ]
  },
  IN: {
    cities: [
      { name: 'Indianapolis', county: 'Marion', baseLat: 39.77, baseLng: -86.16, zipPrefix: '462', timezone: 'America/Indiana/Indianapolis', countyFIPS: '18097' },
      { name: 'Fort Wayne', county: 'Allen', baseLat: 41.08, baseLng: -85.14, zipPrefix: '468', timezone: 'America/Indiana/Indianapolis', countyFIPS: '18003' },
      { name: 'Evansville', county: 'Vanderburgh', baseLat: 37.97, baseLng: -87.56, zipPrefix: '477', timezone: 'America/Chicago', countyFIPS: '18163' },
      { name: 'South Bend', county: 'St. Joseph', baseLat: 41.68, baseLng: -86.25, zipPrefix: '466', timezone: 'America/Indiana/Indianapolis', countyFIPS: '18141' },
    ]
  },
  NC: {
    cities: [
      { name: 'Charlotte', county: 'Mecklenburg', baseLat: 35.23, baseLng: -80.84, zipPrefix: '282', timezone: 'America/New_York', countyFIPS: '37119' },
      { name: 'Raleigh', county: 'Wake', baseLat: 35.78, baseLng: -78.64, zipPrefix: '276', timezone: 'America/New_York', countyFIPS: '37183' },
      { name: 'Greensboro', county: 'Guilford', baseLat: 36.07, baseLng: -79.79, zipPrefix: '274', timezone: 'America/New_York', countyFIPS: '37081' },
      { name: 'Durham', county: 'Durham', baseLat: 35.99, baseLng: -78.90, zipPrefix: '277', timezone: 'America/New_York', countyFIPS: '37063' },
      { name: 'Winston-Salem', county: 'Forsyth', baseLat: 36.10, baseLng: -80.24, zipPrefix: '271', timezone: 'America/New_York', countyFIPS: '37067' },
    ]
  },
  SC: {
    cities: [
      { name: 'Charleston', county: 'Charleston', baseLat: 32.78, baseLng: -79.93, zipPrefix: '294', timezone: 'America/New_York', countyFIPS: '45019' },
      { name: 'Columbia', county: 'Richland', baseLat: 34.00, baseLng: -81.03, zipPrefix: '292', timezone: 'America/New_York', countyFIPS: '45079' },
      { name: 'Greenville', county: 'Greenville', baseLat: 34.85, baseLng: -82.40, zipPrefix: '296', timezone: 'America/New_York', countyFIPS: '45045' },
    ]
  },
  VA: {
    cities: [
      { name: 'Virginia Beach', county: 'Virginia Beach', baseLat: 36.85, baseLng: -75.98, zipPrefix: '234', timezone: 'America/New_York', countyFIPS: '51810' },
      { name: 'Norfolk', county: 'Norfolk', baseLat: 36.85, baseLng: -76.29, zipPrefix: '235', timezone: 'America/New_York', countyFIPS: '51710' },
      { name: 'Richmond', county: 'Richmond', baseLat: 37.54, baseLng: -77.44, zipPrefix: '232', timezone: 'America/New_York', countyFIPS: '51760' },
      { name: 'Arlington', county: 'Arlington', baseLat: 38.88, baseLng: -77.10, zipPrefix: '222', timezone: 'America/New_York', countyFIPS: '51013' },
    ]
  },
  PA: {
    cities: [
      { name: 'Philadelphia', county: 'Philadelphia', baseLat: 39.95, baseLng: -75.17, zipPrefix: '191', timezone: 'America/New_York', countyFIPS: '42101' },
      { name: 'Pittsburgh', county: 'Allegheny', baseLat: 40.44, baseLng: -79.99, zipPrefix: '152', timezone: 'America/New_York', countyFIPS: '42003' },
      { name: 'Allentown', county: 'Lehigh', baseLat: 40.60, baseLng: -75.49, zipPrefix: '181', timezone: 'America/New_York', countyFIPS: '42077' },
      { name: 'Erie', county: 'Erie', baseLat: 42.13, baseLng: -80.09, zipPrefix: '165', timezone: 'America/New_York', countyFIPS: '42049' },
    ]
  },
  MN: {
    cities: [
      { name: 'Minneapolis', county: 'Hennepin', baseLat: 44.98, baseLng: -93.27, zipPrefix: '554', timezone: 'America/Chicago', countyFIPS: '27053' },
      { name: 'Saint Paul', county: 'Ramsey', baseLat: 44.95, baseLng: -93.09, zipPrefix: '551', timezone: 'America/Chicago', countyFIPS: '27123' },
      { name: 'Rochester', county: 'Olmsted', baseLat: 44.02, baseLng: -92.47, zipPrefix: '559', timezone: 'America/Chicago', countyFIPS: '27109' },
      { name: 'Duluth', county: 'St. Louis', baseLat: 46.79, baseLng: -92.10, zipPrefix: '558', timezone: 'America/Chicago', countyFIPS: '27137' },
    ]
  },
  WI: {
    cities: [
      { name: 'Milwaukee', county: 'Milwaukee', baseLat: 43.04, baseLng: -87.91, zipPrefix: '532', timezone: 'America/Chicago', countyFIPS: '55079' },
      { name: 'Madison', county: 'Dane', baseLat: 43.07, baseLng: -89.40, zipPrefix: '537', timezone: 'America/Chicago', countyFIPS: '55025' },
      { name: 'Green Bay', county: 'Brown', baseLat: 44.51, baseLng: -88.02, zipPrefix: '543', timezone: 'America/Chicago', countyFIPS: '55009' },
    ]
  },
  MO: {
    cities: [
      { name: 'Kansas City', county: 'Jackson', baseLat: 39.10, baseLng: -94.58, zipPrefix: '641', timezone: 'America/Chicago', countyFIPS: '29095' },
      { name: 'Saint Louis', county: 'St. Louis City', baseLat: 38.63, baseLng: -90.20, zipPrefix: '631', timezone: 'America/Chicago', countyFIPS: '29510' },
      { name: 'Springfield', county: 'Greene', baseLat: 37.22, baseLng: -93.29, zipPrefix: '658', timezone: 'America/Chicago', countyFIPS: '29077' },
    ]
  },
  KS: {
    cities: [
      { name: 'Wichita', county: 'Sedgwick', baseLat: 37.69, baseLng: -97.34, zipPrefix: '672', timezone: 'America/Chicago', countyFIPS: '20173' },
      { name: 'Overland Park', county: 'Johnson', baseLat: 38.98, baseLng: -94.67, zipPrefix: '662', timezone: 'America/Chicago', countyFIPS: '20091' },
      { name: 'Kansas City', county: 'Wyandotte', baseLat: 39.11, baseLng: -94.63, zipPrefix: '661', timezone: 'America/Chicago', countyFIPS: '20209' },
    ]
  },
  OK: {
    cities: [
      { name: 'Oklahoma City', county: 'Oklahoma', baseLat: 35.47, baseLng: -97.52, zipPrefix: '731', timezone: 'America/Chicago', countyFIPS: '40109' },
      { name: 'Tulsa', county: 'Tulsa', baseLat: 36.15, baseLng: -95.99, zipPrefix: '741', timezone: 'America/Chicago', countyFIPS: '40143' },
      { name: 'Norman', county: 'Cleveland', baseLat: 35.22, baseLng: -97.44, zipPrefix: '730', timezone: 'America/Chicago', countyFIPS: '40027' },
    ]
  },
  LA: {
    cities: [
      { name: 'New Orleans', county: 'Orleans', baseLat: 29.95, baseLng: -90.07, zipPrefix: '701', timezone: 'America/Chicago', countyFIPS: '22071' },
      { name: 'Baton Rouge', county: 'East Baton Rouge', baseLat: 30.45, baseLng: -91.15, zipPrefix: '708', timezone: 'America/Chicago', countyFIPS: '22033' },
      { name: 'Shreveport', county: 'Caddo', baseLat: 32.53, baseLng: -93.75, zipPrefix: '711', timezone: 'America/Chicago', countyFIPS: '22017' },
    ]
  },
  AL: {
    cities: [
      { name: 'Birmingham', county: 'Jefferson', baseLat: 33.52, baseLng: -86.81, zipPrefix: '352', timezone: 'America/Chicago', countyFIPS: '01073' },
      { name: 'Montgomery', county: 'Montgomery', baseLat: 32.37, baseLng: -86.30, zipPrefix: '361', timezone: 'America/Chicago', countyFIPS: '01101' },
      { name: 'Mobile', county: 'Mobile', baseLat: 30.69, baseLng: -88.04, zipPrefix: '366', timezone: 'America/Chicago', countyFIPS: '01097' },
      { name: 'Huntsville', county: 'Madison', baseLat: 34.73, baseLng: -86.59, zipPrefix: '358', timezone: 'America/Chicago', countyFIPS: '01089' },
    ]
  },
  MS: {
    cities: [
      { name: 'Jackson', county: 'Hinds', baseLat: 32.30, baseLng: -90.18, zipPrefix: '392', timezone: 'America/Chicago', countyFIPS: '28049' },
      { name: 'Gulfport', county: 'Harrison', baseLat: 30.37, baseLng: -89.09, zipPrefix: '395', timezone: 'America/Chicago', countyFIPS: '28047' },
    ]
  },
  AR: {
    cities: [
      { name: 'Little Rock', county: 'Pulaski', baseLat: 34.75, baseLng: -92.29, zipPrefix: '722', timezone: 'America/Chicago', countyFIPS: '05119' },
      { name: 'Fort Smith', county: 'Sebastian', baseLat: 35.39, baseLng: -94.39, zipPrefix: '729', timezone: 'America/Chicago', countyFIPS: '05131' },
      { name: 'Fayetteville', county: 'Washington', baseLat: 36.06, baseLng: -94.16, zipPrefix: '727', timezone: 'America/Chicago', countyFIPS: '05143' },
    ]
  },
  KY: {
    cities: [
      { name: 'Louisville', county: 'Jefferson', baseLat: 38.25, baseLng: -85.76, zipPrefix: '402', timezone: 'America/Kentucky/Louisville', countyFIPS: '21111' },
      { name: 'Lexington', county: 'Fayette', baseLat: 38.04, baseLng: -84.50, zipPrefix: '405', timezone: 'America/New_York', countyFIPS: '21067' },
      { name: 'Bowling Green', county: 'Warren', baseLat: 36.99, baseLng: -86.44, zipPrefix: '421', timezone: 'America/Chicago', countyFIPS: '21227' },
    ]
  },
  WV: {
    cities: [
      { name: 'Charleston', county: 'Kanawha', baseLat: 38.35, baseLng: -81.63, zipPrefix: '253', timezone: 'America/New_York', countyFIPS: '54039' },
      { name: 'Huntington', county: 'Cabell', baseLat: 38.42, baseLng: -82.45, zipPrefix: '257', timezone: 'America/New_York', countyFIPS: '54011' },
    ]
  },
  IA: {
    cities: [
      { name: 'Des Moines', county: 'Polk', baseLat: 41.59, baseLng: -93.62, zipPrefix: '503', timezone: 'America/Chicago', countyFIPS: '19153' },
      { name: 'Cedar Rapids', county: 'Linn', baseLat: 41.98, baseLng: -91.67, zipPrefix: '524', timezone: 'America/Chicago', countyFIPS: '19113' },
      { name: 'Davenport', county: 'Scott', baseLat: 41.52, baseLng: -90.58, zipPrefix: '528', timezone: 'America/Chicago', countyFIPS: '19163' },
    ]
  },
  NE: {
    cities: [
      { name: 'Omaha', county: 'Douglas', baseLat: 41.26, baseLng: -95.94, zipPrefix: '681', timezone: 'America/Chicago', countyFIPS: '31055' },
      { name: 'Lincoln', county: 'Lancaster', baseLat: 40.81, baseLng: -96.70, zipPrefix: '685', timezone: 'America/Chicago', countyFIPS: '31109' },
    ]
  },
  SD: {
    cities: [
      { name: 'Sioux Falls', county: 'Minnehaha', baseLat: 43.55, baseLng: -96.73, zipPrefix: '571', timezone: 'America/Chicago', countyFIPS: '46099' },
      { name: 'Rapid City', county: 'Pennington', baseLat: 44.08, baseLng: -103.23, zipPrefix: '577', timezone: 'America/Denver', countyFIPS: '46103' },
    ]
  },
  ND: {
    cities: [
      { name: 'Fargo', county: 'Cass', baseLat: 46.88, baseLng: -96.79, zipPrefix: '581', timezone: 'America/Chicago', countyFIPS: '38017' },
      { name: 'Bismarck', county: 'Burleigh', baseLat: 46.81, baseLng: -100.78, zipPrefix: '585', timezone: 'America/Chicago', countyFIPS: '38015' },
    ]
  },
  MT: {
    cities: [
      { name: 'Billings', county: 'Yellowstone', baseLat: 45.79, baseLng: -108.54, zipPrefix: '591', timezone: 'America/Denver', countyFIPS: '30111' },
      { name: 'Missoula', county: 'Missoula', baseLat: 46.87, baseLng: -114.00, zipPrefix: '598', timezone: 'America/Denver', countyFIPS: '30063' },
      { name: 'Great Falls', county: 'Cascade', baseLat: 47.50, baseLng: -111.29, zipPrefix: '594', timezone: 'America/Denver', countyFIPS: '30013' },
    ]
  },
  WY: {
    cities: [
      { name: 'Cheyenne', county: 'Laramie', baseLat: 41.14, baseLng: -104.82, zipPrefix: '820', timezone: 'America/Denver', countyFIPS: '56021' },
      { name: 'Casper', county: 'Natrona', baseLat: 42.87, baseLng: -106.31, zipPrefix: '826', timezone: 'America/Denver', countyFIPS: '56025' },
    ]
  },
  ID: {
    cities: [
      { name: 'Boise', county: 'Ada', baseLat: 43.62, baseLng: -116.21, zipPrefix: '837', timezone: 'America/Boise', countyFIPS: '16001' },
      { name: 'Meridian', county: 'Ada', baseLat: 43.61, baseLng: -116.39, zipPrefix: '836', timezone: 'America/Boise', countyFIPS: '16001' },
      { name: 'Idaho Falls', county: 'Bonneville', baseLat: 43.49, baseLng: -112.03, zipPrefix: '834', timezone: 'America/Boise', countyFIPS: '16019' },
    ]
  },
};

// Seeded random number generator for consistent data
function seededRandom(seed: number): () => number {
  let state = seed;
  return function() {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

// Generate zip codes for all cities
function generateZipCodes(): TerritoryZip[] {
  const territories: TerritoryZip[] = [];
  const random = seededRandom(42); // Use fixed seed for consistent generation
  
  Object.entries(stateData).forEach(([state, data]) => {
    data.cities.forEach(city => {
      // Generate 10-15 zip codes per city
      const zipCount = 10 + Math.floor(random() * 6);
      
      for (let i = 0; i < zipCount; i++) {
        const suffix = String(i).padStart(2, '0');
        const zip = city.zipPrefix + suffix;
        
        // Add slight variation to coordinates
        const latVariation = (random() - 0.5) * 0.1;
        const lngVariation = (random() - 0.5) * 0.1;
        
        // Random population between 5000 and 85000
        const population = 5000 + Math.floor(random() * 80000);
        
        // Random median income between 45000 and 150000
        const medianIncome = 45000 + Math.floor(random() * 105000);
        
        // ~15% of territories are taken
        const available = random() > 0.15;
        
        territories.push({
          zip,
          city: city.name,
          state,
          county: city.county,
          latitude: Number((city.baseLat + latVariation).toFixed(4)),
          longitude: Number((city.baseLng + lngVariation).toFixed(4)),
          population,
          medianIncome,
          timezone: city.timezone,
          countyFIPS: city.countyFIPS,
          available,
          monthlyPrice: 45,
        });
      }
    });
  });
  
  return territories;
}

export const territoryZips: TerritoryZip[] = generateZipCodes();

// Store taken territories for real-time simulation
export const takenTerritories = new Set<string>(
  territoryZips.filter(t => !t.available).map(t => t.zip)
);

export function getTerritoryByZip(zip: string): TerritoryZip | undefined {
  return territoryZips.find(t => t.zip === zip);
}

export function getAvailableTerritories(): TerritoryZip[] {
  return territoryZips.filter(t => t.available && !takenTerritories.has(t.zip));
}

export function getTerritoriesByState(state: string): TerritoryZip[] {
  return territoryZips.filter(t => t.state === state);
}

export function getTotalTerritoryCount(): number {
  return territoryZips.length;
}

export function getAvailableTerritoryCount(): number {
  return territoryZips.filter(t => t.available && !takenTerritories.has(t.zip)).length;
}

export function getTakenTerritoryCount(): number {
  return takenTerritories.size;
}

export function getTerritoriesByStateGrouped(): Record<string, TerritoryZip[]> {
  const grouped: Record<string, TerritoryZip[]> = {};
  territoryZips.forEach(t => {
    if (!grouped[t.state]) {
      grouped[t.state] = [];
    }
    grouped[t.state].push(t);
  });
  return grouped;
}

export function claimTerritory(zip: string): boolean {
  const territory = getTerritoryByZip(zip);
  if (territory && territory.available && !takenTerritories.has(zip)) {
    takenTerritories.add(zip);
    return true;
  }
  return false;
}

export function releaseTerritory(zip: string): boolean {
  if (takenTerritories.has(zip)) {
    takenTerritories.delete(zip);
    return true;
  }
  return false;
}

// Get state statistics
export function getStateStats(): { state: string; total: number; available: number; taken: number }[] {
  const grouped = getTerritoriesByStateGrouped();
  return Object.entries(grouped).map(([state, territories]) => ({
    state,
    total: territories.length,
    available: territories.filter(t => t.available && !takenTerritories.has(t.zip)).length,
    taken: territories.filter(t => !t.available || takenTerritories.has(t.zip)).length,
  })).sort((a, b) => b.total - a.total);
}
