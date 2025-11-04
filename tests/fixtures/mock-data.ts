export const testUsers = {
  admin: {
    email: 'admin@confia.com',
    password: process.env.user_pass || 'admin@confia.com@@',
  },
  user: {
    email: 'admin@confia.com',
    password: process.env.user_pass || 'admin@confia.com@@',
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

export const generateUserEmail = (prefix = 'user') => {
  const id = Math.random().toString(36).substring(2, 6).toLowerCase();
  return `${prefix}.${id}@test.com`;
};

export const generateDni = () => {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return randomNum.toString();
};
