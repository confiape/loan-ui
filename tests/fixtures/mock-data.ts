export const testUsers = {
  admin: {
    email: 'admin@confia.com',
    password: process.env.user_pass,
  },
  user: {
    email: 'admin@confia.com',
    password: process.env.user_pass,
  },
};

export const testCompanies = {
  valid: {
    name: 'Test Company Inc.',
  },
  short: {
    name: 'A', // Invalid: < 2 chars
  },
  forUpdate: {
    name: 'Updated Company Name',
  },
  forSearch: {
    name: 'Searchable Company',
  },
};

export const generateCompanyName = (prefix = 'Company') => {
  const id = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${id}`;
};
