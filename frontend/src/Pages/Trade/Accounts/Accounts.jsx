import React from 'react';
import AccountHeader from './components/AccountHeader';
import ProfileSection from './components/ProfileSection';
import FundsBanner from './components/FundsBanner';
import QuickSettings from './components/QuickSettings';
import SupportSection from './components/SupportSection';
import AppVersion from './components/AppVersion';

function Accounts() {
    return (
        <div className="h-full flex flex-col bg-[var(--bg-main)] text-[var(--text-secondary)] font-sans overflow-y-auto customscrollbar">
            <AccountHeader />

            <div className="p-4 md:p-6 max-w-7xl mx-auto w-full pb-24">
                <ProfileSection />
                <FundsBanner />
                <QuickSettings />
                <SupportSection />
                <AppVersion />
            </div>
        </div>
    )
}

export default Accounts;
