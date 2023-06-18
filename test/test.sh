#!/bin/bash

job_id=$(bacalhau docker run --id-only --input=https://aave-api-v2.aave.com/data/pools  hackaccounts/test-bacalhau-script2)

echo "Job ID: $job_id"
bacalhau get $job_id

# Extract the substring until the first '-'
sub_str=$(echo $job_id | cut -d'-' -f 1)

echo "Sub-string: $sub_str"

# Concatenate "job-" to the extracted substring
folder="job-${sub_str}"
echo "Folder: $folder"

# Print the result
file="$folder/outputs/result.json"
if [ -f "$file" ]; then
    cat $file
else
    echo "File $file does not exist."
fi
