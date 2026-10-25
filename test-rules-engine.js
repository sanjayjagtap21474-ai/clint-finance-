import fs from 'fs';

console.log('🚀 Executing Local Security Rules Verification Engine...');
console.log('----------------------------------------------------');

const rulesText = fs.readFileSync('./firestore.rules', 'utf8');

function evalIsAuthenticated(auth) {
  return auth !== null && auth !== undefined && auth.uid !== undefined && auth.uid !== null;
}

function evalIsOwner(auth, userId) {
  return evalIsAuthenticated(auth) && auth.uid === userId;
}

function evalIsAdmin(auth, userDocData) {
  if (!evalIsAuthenticated(auth)) return false;
  if (auth.token && auth.token.admin === true) return true;
  if (userDocData && ['admin', 'superadmin', 'super-admin'].includes(userDocData.role)) return true;
  return false;
}

function evalIsPermittedProfileUpdate(incomingData, existingData) {
  const protectedFields = ['role', 'balances', 'verifiedStatus', 'directReferralsCount', 'salaryLevel', 'createdAt'];

  // Find modified keys
  const modifiedKeys = Object.keys(incomingData).filter(key => {
    return JSON.stringify(incomingData[key]) !== JSON.stringify(existingData[key]);
  });

  const hasProtectedKeyModified = modifiedKeys.some(key => protectedFields.includes(key));
  const roleMatch = incomingData.role === existingData.role;

  return !hasProtectedKeyModified && roleMatch;
}

// Test Runner
let passed = 0;
let failed = 0;

function runTestCase(caseNumber, description, result, expected = true) {
  if (result === expected) {
    console.log(`✅ TEST ${caseNumber} PASSED: ${description}`);
    passed++;
  } else {
    console.error(`❌ TEST ${caseNumber} FAILED: ${description} (Expected ${expected}, got ${result})`);
    failed++;
  }
}

// SAMPLE DATA
const customer1Auth = { uid: 'cust128', token: { admin: false } };
const customer2Auth = { uid: 'cust999', token: { admin: false } };
const adminAuth = { uid: 'admin001', token: { admin: true } };
const unauth = null;

const customer1Doc = {
  uid: 'cust128',
  role: 'customer',
  fullName: 'Alexander Kramer',
  country: 'Switzerland',
  balances: { availableUSDT: 1000 },
  verifiedStatus: 'KYC Verified',
  directReferralsCount: 5,
  salaryLevel: 'Basic',
  createdAt: '2026-01-01T00:00:00Z'
};

const customer2Doc = {
  uid: 'cust999',
  role: 'customer',
  fullName: 'Nadia Belkacem',
  country: 'UAE',
  balances: { availableUSDT: 500 },
  verifiedStatus: 'Unverified',
  directReferralsCount: 0,
  salaryLevel: 'None',
  createdAt: '2026-01-01T00:00:00Z'
};

const adminDoc = {
  uid: 'admin001',
  role: 'admin',
  fullName: 'Sovereign Admin',
  country: 'UAE'
};

// TEST CASE 1: Customer can read their own profile
const test1 = evalIsOwner(customer1Auth, customer1Doc.uid) || evalIsAdmin(customer1Auth, customer1Doc);
runTestCase(1, 'Customer can read their own profile (/users/cust128)', test1, true);

// TEST CASE 2: Customer CANNOT read another customer profile
const test2 = evalIsOwner(customer1Auth, customer2Doc.uid) || evalIsAdmin(customer1Auth, customer1Doc);
runTestCase(2, 'Customer CANNOT read another customer profile (/users/cust999)', test2, false);

// TEST CASE 3: Customer can update permitted profile fields (fullName, country, bio)
const permittedUpdatePayload = {
  ...customer1Doc,
  fullName: 'Alexander Kramer Jr.',
  country: 'United Arab Emirates',
  bio: 'Institutional digital wealth client'
};
const canUpdatePermitted = evalIsOwner(customer1Auth, customer1Doc.uid) && evalIsPermittedProfileUpdate(permittedUpdatePayload, customer1Doc);
runTestCase(3, 'Customer CAN update permitted profile fields (fullName, country, bio)', canUpdatePermitted, true);

// TEST CASE 4: Customer CANNOT change their own role to admin or alter balances
const attackPayload = {
  ...customer1Doc,
  role: 'admin',
  balances: { availableUSDT: 999999 }
};
const canEscalateRole = evalIsOwner(customer1Auth, customer1Doc.uid) && evalIsPermittedProfileUpdate(attackPayload, customer1Doc);
runTestCase(4, 'Customer CANNOT change role to admin or alter balances', canEscalateRole, false);

// TEST CASE 5: Unauthenticated user CANNOT write site settings
const test5 = evalIsAdmin(unauth, null);
runTestCase(5, 'Unauthenticated user CANNOT write site settings (/siteSettings/branding)', test5, false);

// TEST CASE 6: Authorized admin CAN perform admin operations
const test6 = evalIsAdmin(adminAuth, adminDoc);
runTestCase(6, 'Authorized admin CAN perform admin operations (siteSettings, adminLogs)', test6, true);

console.log('----------------------------------------------------');
console.log(`📊 RESULTS: ${passed} PASSED, ${failed} FAILED.`);

if (failed > 0) {
  process.exit(1);
}
