import React from 'react';
import TradingAccount from './TradingAccount/TradingAccount';
import InvestmentOptions from './InvestmentOptions/InvestmentOptions';
import Steps from './Steps/Steps';
import Benefits from './Benefits/Benefits';
import AccountTypes from './AccountTypes/AccountTypes';
import FAQs from './FAQs/FAQs';
import OpenAccount from './OpenAccount/OpenAccount';

const Signup = () => {
    return (
        <>
            <TradingAccount />
            <InvestmentOptions />
            <Steps />
            <Benefits />
            <AccountTypes />
            <FAQs />
            <OpenAccount />
        </>
    );
};

export default Signup;
