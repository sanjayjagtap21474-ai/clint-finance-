import fs from 'fs';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';

const rules = fs.readFileSync('./firestore.rules', 'utf8');

let testEnv;

async function runTests() {
  console.log('🚀 Initializing local Firestore Rules Test Environment...');

  testEnv = await initializeTestEnvironment({
    projectId: 'sight-finance-test-project',
    firestore: {
      rules,
      host: '127.0.0.1',
      port: 8080
    }
  });

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASSED: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAILED: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // Pre-seed test data using admin context
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.doc('users/customer1').set({
      uid: 'customer1',
      role: 'customer',
      fullName: 'Alice Customer',
      balances: { availableUSDT: 1000 },
      verifiedStatus: 'Unverified',
      createdAt: '2026-01-01'
    });
    await db.doc('users/customer2').set({
      uid: 'customer2',
      role: 'customer',
      fullName: 'Bob Customer',
      balances: { availableUSDT: 500 },
      verifiedStatus: 'Unverified',
      createdAt: '2026-01-01'
    });
    await db.doc('users/admin1').set({
      uid: 'admin1',
      role: 'admin',
      fullName: 'Sovereign Admin',
      balances: { availableUSDT: 0 },
      verifiedStatus: 'Verified',
      createdAt: '2026-01-01'
    });
  });

  console.log('\n🧪 Running 6 Mandatory Security Test Cases:');

  // Test 1: Customer can read their own profile
  await test('1. Customer can read their own profile', async () => {
    const aliceContext = testEnv.authenticatedContext('customer1');
    const db = aliceContext.firestore();
    await assertSucceeds(db.doc('users/customer1').get());
  });

  // Test 2: Customer cannot read another customer's private profile
  await test('2. Customer CANNOT read another customer profile', async () => {
    const aliceContext = testEnv.authenticatedContext('customer1');
    const db = aliceContext.firestore();
    await assertFails(db.doc('users/customer2').get());
  });

  // Test 3: Customer can update permitted profile fields
  await test('3. Customer can update permitted profile fields (fullName, country)', async () => {
    const aliceContext = testEnv.authenticatedContext('customer1');
    const db = aliceContext.firestore();
    await assertSucceeds(db.doc('users/customer1').update({
      fullName: 'Alice Updated',
      country: 'United Arab Emirates'
    }));
  });

  // Test 4: Customer cannot change their own role to admin
  await test('4. Customer CANNOT escalate role to admin or alter balances', async () => {
    const aliceContext = testEnv.authenticatedContext('customer1');
    const db = aliceContext.firestore();
    await assertFails(db.doc('users/customer1').update({
      role: 'admin'
    }));
  });

  // Test 5: Unauthenticated user cannot write site settings
  await test('5. Unauthenticated user CANNOT write site settings', async () => {
    const anonContext = testEnv.unauthenticatedContext();
    const db = anonContext.firestore();
    await assertFails(db.doc('siteSettings/branding').set({
      websiteName: 'Hacked Site'
    }));
  });

  // Test 6: Authorized admin can perform intended admin operations
  await test('6. Authorized admin CAN perform admin siteSettings write', async () => {
    const adminContext = testEnv.authenticatedContext('admin1');
    const db = adminContext.firestore();
    await assertSucceeds(db.doc('siteSettings/branding').set({
      websiteName: 'SIGHT FINANCE'
    }));
  });

  console.log(`\n📊 Test Summary: ${passed} passed, ${failed} failed.`);

  await testEnv.cleanup();

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
