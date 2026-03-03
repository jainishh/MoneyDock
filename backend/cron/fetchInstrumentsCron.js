import cron from 'node-cron';
import axios from 'axios';
import Instrument from '../models/Instrument.js';

const fetchInstruments = async () => {
    try {
        console.log("Starting Scheduled Instrument Data Fetch...");

        const url = "https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json";

        console.log(`Downloading JSON from ${url}...`);
        const response = await axios.get(url, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        const instruments = response.data;
        console.log(`Fetched ${instruments.length} instruments.`);

        if (instruments.length > 0) {
            console.log("Clearing existing data...");
            await Instrument.deleteMany({});

            console.log("Inserting new data...");

            // Batch Insertion (Chunk size 5000)
            const BATCH_SIZE = 5000;
            for (let i = 0; i < instruments.length; i += BATCH_SIZE) {
                const chunk = instruments.slice(i, i + BATCH_SIZE);
                try {
                    await Instrument.insertMany(chunk, { ordered: false });
                    console.log(`Inserted batch ${i} to ${i + chunk.length}`);
                } catch (error) {
                    console.error(`Error inserting batch ${i}:`, error.message);
                }
            }

            console.log("Data Insertion Complete!");
        } else {
            console.log("No instruments found in the response.");
        }

    } catch (error) {
        console.error("Error fetching instruments:", error);
    }
};

const setupCronJobs = () => {
    // Schedule task to run at 00:00 daily
    cron.schedule('0 0 * * *', () => {
        console.log('Running daily instrument fetch job...');
        fetchInstruments();
    });

    console.log('Cron jobs scheduled: Daily Instrument Fetch at 00:00');
};

export default setupCronJobs;
export { fetchInstruments };
