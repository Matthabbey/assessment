const express = require('express')
const router = express.Router()
const multer = require('multer');
const { Readable, Transform } = require('node:stream')
const csvParser = require('csv-parser');
const streamDataEntry = require('../model')


// Set up Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      // Check if file is provided
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
  
      // Stream and parse CSV file
      const entries = await FileuploadProcess(req.file.buffer);
  
      // Divide entries into batches of 1000
      const batches = [];
      let batch = [];
      for (const entry of entries) {
        batch.push(entry);
        if (batch.length === 1000) {
          batches.push(batch);
          batch = [];
        }
      }
      if (batch.length > 0) {
        batches.push(batch);
      }
  
      // Save entries in batches
      for (const batch of batches) {
        //using the insertMany method instead of inserting each entry individually. This is more efficient
        await streamDataEntry.insertMany(batch);
      }
  
      res.status(200).send('Your data file has been successfully uploaded.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Proceessing data file error, please check file and try again.');
    }
  });
  
  // Function to normalize MSISDN to international format
  function normalizeMSISDN(msisdn) {
    // Example: Assuming all MSISDNs start with '0' and you want to replace it with '+234'
    return `+44${msisdn.slice(1)}`;
  }
  
  // Function to process CSV file
  async function FileuploadProcess(buffer) {
 
    const readStream = new Readable();
    readStream.push(buffer);
    readStream.push(null); // Signal the end of the stream
  
    const entries = [];
  
    const csvTransform = csvParser({
      mapHeaders: ({ header, index }) => header.trim(),
    });
  
    const transformStream = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        const MSISDN = normalizeMSISDN(chunk.MSISDN);
  
        this.push({
          MSISDN,
          quantity: parseInt(chunk.quantity),
          narration: chunk.narration,
        });
        callback();
      },
    });
  
    // Pipe the ReadStream through csv-parser and the custom transform stream
    readStream.pipe(csvTransform).pipe(transformStream);
  
    // Collect the transformed entries
    for await (const entry of transformStream) {
      entries.push(entry);
    }
  
    return entries;
  }
  

  module.exports = router;
