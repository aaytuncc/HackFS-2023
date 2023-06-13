const axios = require('axios');
const fs = require("fs");

const marketQuery = `
    query {
        markets {
            borrowRate
            cash
            collateralFactor
            exchangeRate
            interestRateModelAddress
            name
            reserves
            supplyRate
            symbol
            id
            totalBorrows
            totalSupply
            underlyingAddress
            underlyingName
            underlyingPrice
            underlyingSymbol
            reserveFactor
            underlyingPriceUSD
        }
    }
    
`

const compound = "https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2"

const getCompoundData = async ()=> {
  try {
    const response = await axios.post(compound, {
      query: marketQuery,
    });
    const jsonString = JSON.stringify(response.data);
    fs.writeFileSync("compound.txt", jsonString, 'utf-8');
  } catch (error) {
    console.log({ error: 'Something went wrong.' });
    console.log(error);  }
};

getCompoundData();