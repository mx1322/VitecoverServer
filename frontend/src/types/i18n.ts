export type Dictionary = {
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
  };
  cta: {
    getQuote: string;
    downloadPdf: string;
    edit: string;
    addDriver: string;
    addVehicle: string;
    uploadDocument: string;
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
