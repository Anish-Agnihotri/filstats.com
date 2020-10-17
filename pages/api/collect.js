import axios from "axios"; // Axios for requests
import Redis from "ioredis"; // Redis for storage

export default async (req, res) => {
  let promises = [], // Array for batched promises
    deals = []; // Array for returned deals

  // Connect to Redis
  const redis = new Redis(process.env.REDIS_URL);

  // Collect statistics from Redis
  const cachedData = await redis.get("stats");

  // If statistics exist
  if (cachedData) {
    // Return cached data
    res.send(cachedData);
  } else {
    // Else, pull fresh data

    // Make array of promises to batch
    for (let i = 0; i < 25; i++) {
      promises.push(
        // Loop through paginated rpc endpoint to collect 2,500 deals
        axios
          .post("https://api.filscan.io:8700/rpc/v1", {
            id: 1,
            jsonrpc: "2.0",
            params: ["", i * 100, 100],
            method: "filscan.GetMarketDeal",
          })
          .then((response) => {
            // Push all deals, destructured, to deals array
            deals.push(...response.data.result.deals);
          })
      );
    }

    // Execute batched requests
    await Promise.all(promises);
    // Collect filecoin price from CoinGecko
    const filecoin_cg = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=filecoin&vs_currencies=usd"
    );

    let totalStored = 0, // Sum storage
      totalPaid = 0, // Sum paid for storage
      totalTime = 0; // Sum time of storage paid for
    const filPrice = filecoin_cg.data.filecoin.usd; // Collect price from filecoin_cg

    // For each deal in deals
    for (const deal of deals) {
      // Ignore deals with 0 price or other errors
      if (deal.storage_price_per_epoch !== "0") {
        // Total stored === bytes to GB
        totalStored += parseInt(deal.piece_size) / Math.pow(1024, 3);

        // Total paid === (Deal time / 30 seconds per epoch) * Price per epoch / FIL 18 decimals
        totalPaid +=
          (((parseFloat(deal.service_end_time) -
            parseFloat(deal.service_start_time)) /
            30) *
            parseFloat(deal.storage_price_per_epoch)) /
          1e18;

        // Total time === deal end time - deal start time
        totalTime +=
          parseFloat(deal.service_end_time) -
          parseFloat(deal.service_start_time);
      }
    }

    // Calculates deal time as a factor of year
    let year_multiplier = 31536000 / (totalTime / deals.length);

    // Create data object with metrics
    let data = {
      update: new Date(),
      gb_per_fil: totalStored / year_multiplier / totalPaid,
      cost_per_gb: (1 / (totalStored / totalPaid)) * filPrice * year_multiplier,
      price_to_amazon: (
        (((1 / (totalStored / totalPaid)) * filPrice * year_multiplier) /
          0.276) *
        100
      ).toFixed(2),
      avg_deal_size: totalStored / deals.length,
      total_stored: totalStored,
      total_paid: totalPaid,
      avg_deal_time: totalTime / deals.length,
      average_paid: totalPaid / deals.length,
    };

    // Update Redis cache with 1hr ttl
    await redis.set("stats", JSON.stringify(data), "EX", 3600);
    // Send data
    res.send(data);
  }
};
