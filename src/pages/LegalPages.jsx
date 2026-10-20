import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, AlertTriangle, FileText, Lock } from '../components/Icons';

export default function LegalPages() {
  const { activePage } = useApp();

  return (
    <div className="container fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '880px' }}>
      {activePage === 'terms' && <TermsView />}
      {activePage === 'privacy' && <PrivacyView />}
      {activePage === 'risk' && <RiskView />}
    </div>
  );
}

function TermsView() {
  return (
    <div className="glass-card gold-rim" style={{ padding: '3rem 2.5rem' }}>
      <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>Legal Framework</div>
      <h1 style={{ fontSize: '2.4rem', color: '#FFF', marginBottom: '1rem' }}>
        Terms & <span className="gold-text">Conditions</span>
      </h1>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Last Updated: October 2026 • Official Governance Edition
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
        <section>
          <h2 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>1. Platform Operational Framework</h2>
          <p>
            SIGHT FINANCE operates as an institutional digital asset wealth management and USDT clearing gateway. All structured growth plans, token asset clearing pipelines, and affiliate rewards adhere to governed platform risk management policies.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>2. Intended Operating Base: Dubai, UAE</h2>
          <p>
            The conceptual architecture is designed for future deployment within the Dubai International Financial Centre (DIFC) or under the jurisdiction of the Virtual Assets Regulatory Authority (VARA) in the United Arab Emirates. Live operations will not commence until all necessary licenses and compliance certifications have been granted.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>3. USDT Asset Ingestion Protocol</h2>
          <p>
            In any production implementation, users must strictly adhere to the designated token contracts and networks (TRC-20 on TRON and BEP-20 on BNB Smart Chain). SIGHT FINANCE assumes no liability for tokens transferred across unsupported networks or to unverified addresses.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>4. Referral and Salary Incentives</h2>
          <p>
            All affiliate bonuses (10% direct bonus) and executive salary tiers (Basic, Silver, Gold) are subject to strict anti-abuse monitoring. Self-referrals, automated script registrations, and artificial volume loops are strictly prohibited and result in permanent disqualification.
          </p>
        </section>
      </div>
    </div>
  );
}

function PrivacyView() {
  return (
    <div className="glass-card gold-rim" style={{ padding: '3rem 2.5rem' }}>
      <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>Data Governance</div>
      <h1 style={{ fontSize: '2.4rem', color: '#FFF', marginBottom: '1rem' }}>
        Privacy <span className="gold-text">Policy</span>
      </h1>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Aligned with UAE Data Protection Law & DIFC Privacy Standards
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
        <section>
          <h2 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>1. Principles of Data Minimisation</h2>
          <p>
            We collect only essential data required to maintain account integrity: full name, encrypted email address, country of residence, and public wallet addresses. We never store private cryptographic keys or plaintext passwords.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>2. Cryptographic Security & Salted Hashing</h2>
          <p>
            Client credentials are encrypted using industry standard Argon2/bcrypt salted hashing algorithms. System audit logs track administrative actions with masked IP addresses to ensure complete auditability while preserving client confidentiality.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>3. Customer Data Sovereignty</h2>
          <p>
            Clients maintain exclusive rights to access their private transaction ledgers and request complete deletion of demo records in accordance with international data protection conventions.
          </p>
        </section>
      </div>
    </div>
  );
}

function RiskView() {
  return (
    <div className="glass-card gold-rim" style={{ padding: '3rem 2.5rem' }}>
      <div className="badge badge-demo" style={{ marginBottom: '0.75rem' }}>Mandatory Notice</div>
      <h1 style={{ fontSize: '2.4rem', color: '#FFF', marginBottom: '1rem' }}>
        Digital Asset <span className="gold-text">Risk Disclosure</span>
      </h1>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        UAE & Global Financial Standards Compliance
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          gap: '0.75rem',
          color: '#FCA5A5'
        }}>
          <AlertTriangle size={24} style={{ flexShrink: 0 }} />
          <div>
            <strong>CRITICAL STATEMENT ON DAILY RETURN CLAIMS:</strong>
            <p style={{ marginTop: '0.35rem', fontSize: '0.85rem' }}>
              A 5% or 6% daily return is an extraordinary theoretical claim and may be unsustainable or misleading if presented as assured. The numbers within Plan A and Plan B are owner-provided sample labels for demonstration testing only and have not been validated by an independent actuary or financial authority.
            </p>
          </div>
        </div>

        <section>
          <h2 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>1. No Guarantee of Performance</h2>
          <p>
            Digital asset markets are subject to extreme price volatility, smart contract risks, regulatory shifts, and liquidity fluctuations. Past simulated figures do not represent future outcomes.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>2. Smart Contract & Blockchain Finality</h2>
          <p>
            Transactions dispatched to blockchain networks (TRON or BNB Smart Chain) are irreversible. Any transmission to an incorrect address or over an incorrect network standard may result in total loss of funds.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', color: '#FFF', marginBottom: '0.5rem' }}>3. Pre-Launch Advisory</h2>
          <p>
            Do not deposit real funds until independent smart contract audits, VARA/DFSA compliance procedures, and custody insurance protocols have been formally certified and published on this domain.
          </p>
        </section>
      </div>
    </div>
  );
}
