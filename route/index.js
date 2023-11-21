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
      
      for (const entry of entries) {
        await streamDataEntry.insertMany(entry);
      }
     res.status(200).send('File has been successfully uploaded.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error processing the file.');
    }
  });
  
  // Function to normalize MSISDN to international format
  function normalizeMSISDN(msisdn) {
    // Example: Assuming all MSISDNs start with '0' and you want to replace it with '+44'
    return `+44${msisdn.slice(1)}`;
  }
  
  // Function to process CSV file
  async function FileuploadProcess(buffer) {
    const entries = [];

    // Use a pipeline to simplify the stream setup
    await new Promise((resolve, reject) => {
      pipeline(
        // Readable stream
        Readable.from(buffer),
  
        // csv-parser
        csvParser({
          mapHeaders: ({ header, index }) => header.trim(),
        }),
  
        // Custom Transform stream
        new Transform({
          objectMode: true,
          transform(chunk, encoding, callback) {
            const MSISDN = normalizeMSISDN(chunk.MSISDN);
            console.time()
            this.push({
              MSISDN,
              quantity: parseInt(chunk.quantity),
              narration: chunk.narration,
            });
            console.time()
            callback();
          },
        }),
  
        // For async iteration and parallel processing
        async function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  
    return entries;
    // const readStream = new Readable();
    // readStream.push(buffer);
    // readStream.push(null); // Signal the end of the stream
  
    // const entries = [];
  
    // const csvTransform = csvParser({
    //   mapHeaders: ({ header, index }) => header.trim(),
    // });
  
    // const transformStream = new Transform({
    //   objectMode: true,
    //   transform(chunk, encoding, callback) {
    //     const MSISDN = normalizeMSISDN(chunk.MSISDN);
  
    //     this.push({
    //       MSISDN,
    //       quantity: parseInt(chunk.quantity),
    //       narration: chunk.narration,
    //     });
    //     callback();
    //   },
    // });
  
    // // Pipe the ReadStream through csv-parser and the custom transform stream
    // readStream.pipe(csvTransform).pipe(transformStream);
  
    // // Collect the transformed entries
    // for await (const entry of transformStream) {
    //   entries.push(entry);
    // }
  
    // return entries;
  }
  

  module.exports = router;
