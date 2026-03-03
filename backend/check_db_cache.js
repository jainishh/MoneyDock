import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OptionChainCache from './models/OptionChainCache.js';

dotenv.config();

async function checkDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const count = await OptionChainCache.countDocuments();
        console.log(`Total records in OptionChainCache: ${count}`);

        if (count > 0) {
            const sample = await OptionChainCache.findOne().sort({ updatedAt: -1 });
            console.log('Latest record:', {
                name: sample.name,
                expirydate: sample.expirydate,
                count: sample.count,
                updatedAt: sample.updatedAt
            });
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDb();
