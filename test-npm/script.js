const { execSync } = require('child_process');

// Run the command and capture the output
const jobID = execSync('bacalhau docker run --id-only --input=https://aave-api-v2.aave.com/data/pools  hackaccounts/test-bacalhau-script2').toString().trim();

console.log(`Job ID: ${jobID}`);

// Run the command with the captured job ID
const result = execSync(`bacalhau get ${jobID}`).toString().trim();

// Extract the substring until the first '-'
const subStr = jobID.split('-')[0];

console.log(`Sub-string: ${subStr}`);

// Concatenate "job-" to the extracted substring
const folder = `job-${subStr}`;

console.log(`Folder: ${folder}`);

// Print the result from the file
const file = `${folder}/outputs/result.json`;
try {
  const fileContent = execSync(`cat ${file}`).toString().trim();
  console.log(fileContent);
} catch (error) {
  console.log(`File ${file} does not exist.`);
}
