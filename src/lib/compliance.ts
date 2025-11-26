export interface LicenseVerification {
  licenseNumber: string;
  type: string;
  state: string;
  expiryDate: Date;
  verified: boolean;
  verificationDate?: Date;
  verificationMethod?: string;
}

export interface InsuranceVerification {
  provider: string;
  policyNumber: string;
  coverageAmount: number;
  expiryDate: Date;
  verified: boolean;
  certificateUrl?: string;
  verificationDate?: Date;
}

export interface ContractorClassification {
  isPlatformEmployer: boolean;
  canSetOwnPrices: boolean;
  canSetOwnSchedule: boolean;
  canWorkForCompetitors: boolean;
  requiresMandatoryTraining: boolean;
  requiresUniform: boolean;
  hasPlatformSupervision: boolean;
  classificationScore: number;
}

export interface StateRequirements {
  state: string;
  minimumLicenseThreshold: number;
  electricalLicenseRequired: boolean;
  plumbingLicenseRequired: boolean;
  hvacLicenseRequired: boolean;
  generalContractorLicenseRequired: boolean;
  platformLicenseRequired: boolean;
  specificRequirements: string[];
}

export interface TerritoryOwnershipAgreement {
  territoryId: string;
  ownerId: string;
  purchasePrice: number;
  activeParticipationRequired: boolean;
  guaranteedReturns: boolean;
  isPassiveInvestment: boolean;
  disclosureAccepted: boolean;
  riskDisclosureAccepted: boolean;
  signedDate: Date;
  agreementUrl: string;
}

export interface DataPrivacyConsent {
  userId: string;
  gdprConsent: boolean;
  ccpaConsent: boolean;
  tcpaConsent: boolean;
  marketingConsent: boolean;
  dataProcessingConsent: boolean;
  consentDate: Date;
  ipAddress: string;
  userAgent: string;
}

export const STATE_REQUIREMENTS: Record<string, StateRequirements> = {
  CA: {
    state: 'California',
    minimumLicenseThreshold: 500,
    electricalLicenseRequired: true,
    plumbingLicenseRequired: true,
    hvacLicenseRequired: true,
    generalContractorLicenseRequired: true,
    platformLicenseRequired: false,
    specificRequirements: ['AB5 compliance', 'Workers comp insurance', 'Contractor license verification']
  },
  TX: {
    state: 'Texas',
    minimumLicenseThreshold: 0,
    electricalLicenseRequired: true,
    plumbingLicenseRequired: true,
    hvacLicenseRequired: true,
    generalContractorLicenseRequired: false,
    platformLicenseRequired: false,
    specificRequirements: ['Trade-specific licenses only', 'No general contractor license required']
  },
  FL: {
    state: 'Florida',
    minimumLicenseThreshold: 0,
    electricalLicenseRequired: true,
    plumbingLicenseRequired: true,
    hvacLicenseRequired: true,
    generalContractorLicenseRequired: true,
    platformLicenseRequired: false,
    specificRequirements: ['State certified or registered', 'County-specific requirements']
  },
  NY: {
    state: 'New York',
    minimumLicenseThreshold: 0,
    electricalLicenseRequired: true,
    plumbingLicenseRequired: true,
    hvacLicenseRequired: true,
    generalContractorLicenseRequired: true,
    platformLicenseRequired: false,
    specificRequirements: ['NYC requires separate licenses', 'Home improvement contractor license']
  }
};

export function evaluateContractorClassification(contractor: any): ContractorClassification {
  const canSetOwnPrices = true;
  const canSetOwnSchedule = true;
  const canWorkForCompetitors = true;
  const requiresMandatoryTraining = false;
  const requiresUniform = false;
  const hasPlatformSupervision = false;

  const score = [
    canSetOwnPrices,
    canSetOwnSchedule,
    canWorkForCompetitors,
    !requiresMandatoryTraining,
    !requiresUniform,
    !hasPlatformSupervision
  ].filter(Boolean).length;

  return {
    isPlatformEmployer: false,
    canSetOwnPrices,
    canSetOwnSchedule,
    canWorkForCompetitors,
    requiresMandatoryTraining,
    requiresUniform,
    hasPlatformSupervision,
    classificationScore: score / 6
  };
}

export function validateLicenseForJobAmount(jobAmount: number, state: string): {
  requiresLicense: boolean;
  reason: string;
} {
  const requirements = STATE_REQUIREMENTS[state];
  
  if (!requirements) {
    return {
      requiresLicense: false,
      reason: 'State requirements not configured'
    };
  }

  if (jobAmount >= requirements.minimumLicenseThreshold) {
    return {
      requiresLicense: true,
      reason: `Jobs over $${requirements.minimumLicenseThreshold} require licensing in ${requirements.state}`
    };
  }

  return {
    requiresLicense: false,
    reason: 'Below minimum threshold'
  };
}

export function validateTradeLicense(tradeType: string, state: string): {
  required: boolean;
  licenseType: string;
} {
  const requirements = STATE_REQUIREMENTS[state];
  
  if (!requirements) {
    return { required: false, licenseType: '' };
  }

  const tradeRequirements: Record<string, boolean> = {
    electrical: requirements.electricalLicenseRequired,
    plumbing: requirements.plumbingLicenseRequired,
    hvac: requirements.hvacLicenseRequired,
    general: requirements.generalContractorLicenseRequired
  };

  const normalized = tradeType.toLowerCase();
  const required = tradeRequirements[normalized] || false;

  return {
    required,
    licenseType: required ? `${state} ${tradeType} License` : ''
  };
}

export function validateTerritoryOwnershipCompliance(agreement: Partial<TerritoryOwnershipAgreement>): {
  isCompliant: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!agreement.activeParticipationRequired) {
    issues.push('Territory ownership must require active participation to avoid securities classification');
  }

  if (agreement.guaranteedReturns) {
    issues.push('Cannot guarantee returns - this may constitute an unregistered security');
  }

  if (agreement.isPassiveInvestment) {
    issues.push('Passive investments may be classified as securities requiring SEC registration');
  }

  if (!agreement.disclosureAccepted || !agreement.riskDisclosureAccepted) {
    issues.push('Must have proper risk disclosure and acceptance');
  }

  return {
    isCompliant: issues.length === 0,
    issues
  };
}

export function generateDataPrivacyConsent(userId: string): DataPrivacyConsent {
  return {
    userId,
    gdprConsent: false,
    ccpaConsent: false,
    tcpaConsent: false,
    marketingConsent: false,
    dataProcessingConsent: false,
    consentDate: new Date(),
    ipAddress: '',
    userAgent: navigator.userAgent
  };
}

export const COMPLIANCE_DOCUMENTS = {
  termsOfService: '/legal/terms-of-service',
  privacyPolicy: '/legal/privacy-policy',
  contractorAgreement: '/legal/contractor-agreement',
  homeownerAgreement: '/legal/homeowner-agreement',
  territoryOwnerAgreement: '/legal/territory-owner-agreement',
  cookiePolicy: '/legal/cookie-policy',
  disputeResolution: '/legal/dispute-resolution'
};

export const INSURANCE_MINIMUMS = {
  generalLiability: 1_000_000,
  workersComp: 1_000_000,
  autoInsurance: 500_000
};
