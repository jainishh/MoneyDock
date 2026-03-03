import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Instrument from '../models/Instrument.js';
import connectDB from '../config/db.js';

dotenv.config();

const fetchInstruments = async () => {
    try {
        console.log("Starting Instrument Data Fetch...");

        // Connect to Database
        await connectDB();

        console.log("Connected to MongoDB.");

        const url = "https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json";
        
        console.log(`Downloading JSON from ${url}...`);
        // Set maxContentLength and maxBodyLength to Infinity for large files
        const response = await axios.get(url, { 
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        const instruments = response.data;
        console.log(`Fetched ${instruments.length} instruments.`);

        if (instruments.length > 0) {
            console.log("Clearing existing data...");
            await Instrument.deleteMany({});
            
            console.log("Inserting new data implementation...");
            
            // Batch Insertion (Chunk size 5000)
            const BATCH_SIZE = 5000;
            for (let i = 0; i < instruments.length; i += BATCH_SIZE) {
                const chunk = instruments.slice(i, i + BATCH_SIZE);
                try {
                    await Instrument.insertMany(chunk, { ordered: false });
                    console.log(`Inserted batch ${i} to ${i + chunk.length}`);
                } catch (error) {
                    console.error(`Error inserting batch ${i}:`, error.message);
                    // Continue to next batch even if this one has issues
                }
            }
            
            console.log("Data Insertion Complete!");
        } else {
            console.log("No instruments found in the response.");
        }

        process.exit();
    } catch (error) {
        console.error("Error fetching instruments:", error);
        process.exit(1);
    }
};

fetchInstruments();
