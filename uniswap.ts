const _axios = require('axios');
const _fs = require("fs");

const positionQuery = `
  query HomeData {
    positions {
      owner
      liquidity
      pool {
        volumeToken0
        volumeToken1
        id
        liquidity
        token1 {
          name
          volume
          totalValueLocked
          symbol
        }
        token0 {
          name
          volume
          totalValueLocked
          symbol
        }
      }
    }
    tokenHourDatas {
      priceUSD
      low
      high
      volume
      token {
        name
        symbol
      }
    }
  }
`;

const poolQuery = `
    query HomeData {
        pools {
        liquidity
        token1 {
            name
            symbol
            totalSupply
            volume
        }
        token0 {
            name
            symbol
            totalSupply
            volume
        }
        id
        }
    }
`

const uniswapV3 = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"

const getUniswapPositionData = async () => {
  try {
    const response = await _axios.post(uniswapV3, {
      query: positionQuery,
    });
    const jsonString = JSON.stringify(response.data);
    _fs.writeFileSync("uniswap_position.txt", jsonString, 'utf-8');
  } catch (error) {
    console.log({ error: 'Something went wrong.' });
    console.log(error);
  }
};

const getUniswapPoolData = async () => {
  try {
    const response = await _axios.post(uniswapV3, {
      query: poolQuery,
    });
    const jsonString = JSON.stringify(response.data);
    _fs.writeFileSync("uniswap_pool.txt", jsonString, 'utf-8');
  } catch (error) {
    console.log({ error: 'Something went wrong.' });
    console.log(error);
  }
};

const args = process.argv.slice(2);

if (args.includes("position")) {
  console.log("Position argument provided");
  console.log("Request is sent. Wait...");
  getUniswapPositionData();
} else {
  console.log("Request is sent. Wait...");
  getUniswapPoolData();
}

