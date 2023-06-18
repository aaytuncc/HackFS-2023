const { execSync } = require('child_process');
const PushAPI = require("@pushprotocol/restapi");
const ethers = require("ethers");
require('dotenv').config();
const yaml = require('js-yaml');
const cron = require('node-cron');
const contractABI = require('./contract_abi'); // Replace with the actual ABI of your deployed contract
const contractAddress = process.env.CONTRACT_ADDRESS; // Replace with the actual address of your deployed contract
// const PK = '5f713bc75f86259d57e633b9b77d8fcee3e26956afebb849932d4880c5f80e75'; // channel private key
const privateKey = process.env.PRIVATE_KEY;
// const Pkey = `0x${PK}`;
const _signer = new ethers.Wallet(privateKey);

var urlInfo = {
    url: 'https://api.calibration.node.glif.io/rpc/v0'
};
var provider = new ethers.providers.JsonRpcProvider(urlInfo, 314159);

// Specify the account that will be used to send transactions
 // Replace with the private key of the account
const wallet = new ethers.Wallet(privateKey, provider);

// Example function to update the contract values
async function updateContractValues(poolAddress, poolName, apy, decimal) {
  try {
    // Connect the wallet to the contract
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // Update the contract values
    const tx = await contract.setBestPool(poolAddress, poolName, apy, decimal);
    await tx.wait(); // Wait for the transaction to be mined

    console.log('Contract values updated successfully.');
  } catch (error) {
    console.error('Error updating contract values:', error);
  }
}


const sendNotification = async(address, name, apy,cid) => {
  try {
    let currentTime = new Date();
    const formattedTime = currentTime.toLocaleDateString() + ' ' + currentTime.toLocaleTimeString();
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer: _signer,
      type: 1, // broadcast
      identityType: 2, // direct payload
      notification: {
        title: `[DYield] Current Best Pool: ${name}`,
        body: `[DYield] Contract: ${address} with APY: ${apy}% Time: ${formattedTime}`
      },
      payload: {
        title: `[DYield] Current Best Pool: ${name}`,
        body: `The contract: ${address} has the best APY at: ${apy}% Time: ${formattedTime} IPFS:https://w3s.link/ipfs/${cid}/outputs/result.json`,
        cta: `Check channel out`,
        img: '' // provide a relevant image URL if required
      },
      // recipients: 'eip155:5:0xdd59D77D2B910D5A002938bE3291240959f3C70f',
      channel: 'eip155:5:0x850E31A514CC4da6A40fb28D0AE5cB854C8C2EbD', // your channel address
      env: 'staging'
    });
    console.log('Notifications sent successfully.');
  } catch (err) {
    console.error('Error: ', err);
  }
  }
  
// Wrap your existing code in a function
async function runWhole() {
  // Run the command and capture the output
  const jobID = execSync('bacalhau docker run --id-only --input=https://aave-api-v2.aave.com/data/pools  hackaccounts/test-bacalhau-script2').toString().trim();

  console.log(`Job ID: ${jobID}`);

 
  // Run the command with the captured job ID
  const result = execSync(`bacalhau get ${jobID}`).toString().trim();
  

  const rawDescribeOutput = execSync(`bacalhau describe ${jobID}`).toString().trim();
  const describeOutput = yaml.load(rawDescribeOutput);
  const cid = describeOutput.State.Executions[0].PublishedResults.CID;

  console.log(`CID: ${cid}`);

  // Extract the substring until the first '-'
  const subStr = jobID.split('-')[0];

  //console.log(`Sub-string: ${subStr}`);
  
  // Concatenate "job-" to the extracted substring
  const folder = `job-${subStr}`;
  
  //console.log(`Folder: ${folder}`);

  // Print the result from the file
  const file = `${folder}/outputs/result.json`;
  try {
    const fileContent = execSync(`cat ${file}`).toString().trim();
    const jsonData = JSON.parse(fileContent);
    console.log(jsonData);

    const bestOne = jsonData.best_one;

    // Convert APY to a string
    let apy = bestOne.apy.toString();
    let decimal = 0
    // Check if there is a decimal point in the APY
    if (apy.includes('.')) {
      decimal = apy.split('.')[1].length; // Number of decimal places
      apy = apy.replace('.', ''); // Remove decimal point
    }
    apy = Number(apy)

    await updateContractValues(bestOne.address, bestOne.name, apy, decimal);
    await sendNotification(bestOne.address, bestOne.name, bestOne.apy,cid);
    execSync(`rm -rf ${folder}`);
  } catch (error) {
    console.log(`File ${file} does not exist.`);
  }
}

cron.schedule('* * * * *', runWhole, {
  scheduled: true,
  timezone: "Europe/Berlin"
});
