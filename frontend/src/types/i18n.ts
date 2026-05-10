export type Dictionary = {
  brandName: string;
  brandInitials: string;
  brandTagline: string;
  nav: {
    home: string;
    products: string;
    quote: string;
    faq: string;
    account: string;
  };
  common: {
    stepLabel: string;
    languageSwitcherLabel: string;
  };
  cta: {
    getQuote: string;
    downloadPdf: string;
    edit: string;
    addDriver: string;
    addVehicle: string;
    uploadDocument: string;
    signOut: string;
    signingOut: string;
  };
  products: {
    title: string;
    intro: string;
    from: string;
    noData: string;
    viewDetail: string;
  };
  quote: {
    title: string;
    intro: string;
    steps: string[];
  };
  auth: {
    tabs: {
      login: string;
      register: string;
      forgot: string;
    };
    headings: {
      login: string;
      register: string;
      forgot: string;
      resetPassword: string;
      chooseNewPassword: string;
      verifyEmail: string;
      verifyingAccount: string;
      verificationComplete: string;
      verificationFailed: string;
    };
    descriptions: {
      login: string;
      register: string;
      forgot: string;
    };
    fields: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
      newPassword: string;
    };
    actions: {
      createAccount: string;
      sendResetLink: string;
      processing: string;
      updating: string;
      updatePassword: string;
      returnToSignIn: string;
      goToSignIn: string;
    };
    notices: {
      accountCreated: string;
      resetEmailSent: string;
      passwordUpdated: string;
      verifyingToken: string;
      emailVerified: string;
    };
    errors: {
      requestFailed: string;
      emailRequired: string;
      fullNameRequired: string;
      passwordMinLength: string;
      passwordsDoNotMatch: string;
      passwordRequired: string;
      unableToContinue: string;
      unableToResetPassword: string;
      missingResetToken: string;
      unableToReset: string;
      unableToVerifyEmail: string;
      missingVerificationToken: string;
    };
  };
  legal: {
    hubTitle: string;
    hubSeoTitle: string;
    hubSeoDescription: string;
    privacySeoTitle: string;
    privacySeoDescription: string;
    termsSeoTitle: string;
    termsSeoDescription: string;
    regulatorySeoTitle: string;
    regulatorySeoDescription: string;
  };
  faq: {
    title: string;
    intro: string;
    empty: string;
  };
  account: {
    title: string;
    welcome: string;
    sidebar: {
      overview: string;
      policies: string;
      drivers: string;
      vehicles: string;
      documents: string;
      settings: string;
    };
    summary: {
      activePolicies: string;
      savedDrivers: string;
      savedVehicles: string;
      pendingDocuments: string;
    };
    recentPolicies: string;
    quickActions: string;
    settings: {
      email: string;
      password: string;
      contact: string;
    };
    documents: {
      drivingLicence: string;
      vehicleRegistration: string;
      proofOfAddress: string;
    };
    statuses: {
      active: string;
      pending: string;
      expired: string;
      uploaded: string;
      missing: string;
      underReview: string;
    };
  };
};
