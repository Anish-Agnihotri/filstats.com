import useSWR from "swr"; // SWR
import Layout from "../components/layout"; // Layout wrapper

export default function Home() {
  // Collect statistics
  const { data } = useSWR("/api/collect");

  return (
    // Layout wrapper for sizing
    <Layout>
      {/* Long header card */}
      <div className="header card">
        <span>
          <span className="status-light"></span> Data updates once per hour.
        </span>
      </div>

      {/* Cost per GB stored */}
      <div className="item card">
        <div>
          <span>Cost per GB (varies by hour)</span>
        </div>
        <div>
          <h1>
            {!data ? "Loading..." : `$${data.cost_per_gb.toFixed(3)} USD`}
          </h1>
          <p>How much does it cost to store 1GB/year?</p>
        </div>
      </div>

      {/* GB / FIL */}
      <div className="item card">
        <div>
          <span>GB / FIL</span>
        </div>
        <div>
          <h1>
            {!data ? "Loading..." : `${data.gb_per_fil.toLocaleString()} GB`}
          </h1>
          <p>How many GB/year can you store per FIL?</p>
        </div>
      </div>

      {/* Relative cost versus Amazon */}
      <div className="item card cost">
        <div>
          <span>Cost vs Amazon</span>
        </div>
        <div>
          <h1>
            {!data
              ? "Loading..."
              : `${
                  // If FIL cost > Amazon
                  data.price_to_amazon > 100
                    ? // Calculate % increase
                      `${(data.price_to_amazon - 100).toFixed(2)}% Costlier`
                    : // Else, calculate how much cheaper
                      `${(100 - data.price_to_amazon).toFixed(2)}% Cheaper`
                }`}
          </h1>
          <p>Filecoin vs Amazon S3 Standard ($0.276/GB/year)</p>
        </div>
      </div>

      {/* Average Storage Market deal size */}
      <div className="item card">
        <div>
          <span>Average Deal Size</span>
        </div>
        <div>
          <h1>
            {!data ? "Loading..." : `${data.avg_deal_size.toLocaleString()} GB`}
          </h1>
          <p>What's the average deal size across the last 2.5K deals?</p>
        </div>
      </div>

      {/* Average deal period (in days)*/}
      <div className="item card">
        <div>
          <span>Average Deal Period</span>
        </div>
        <div>
          <h1>
            {!data
              ? "Loading..."
              : // Divide retrieved seconds by seconds in day (86,400)
                `${(data.avg_deal_time / 86400).toFixed(2)} Days`}
          </h1>
          <p>What's the average deal period for the last 2.5K deals?</p>
        </div>
      </div>

      {/* Average deal cost */}
      <div className="item card">
        <div>
          <span>Average Deal Cost</span>
        </div>
        <div>
          <h1>
            {!data ? "Loading..." : `${data.average_paid.toFixed(5)} FIL`}
          </h1>
          <p>What's the average total cost across the last 2.5K deals?</p>
        </div>
      </div>

      {/* Total stored (in GB) across last 2,500 deals */}
      <div className="item card">
        <div>
          <span>Total Stored (2,500 deals)</span>
        </div>
        <div>
          <h1>
            {!data ? "Loading..." : `${data.total_stored.toLocaleString()} GB`}
          </h1>
          <p>What's the sum GB stored across the last 2.5K deals?</p>
        </div>
      </div>

      {/* Total FIl paid across last 2,500 deals */}
      <div className="item card">
        <div>
          <span>Total FIL paid (2,500 deals)</span>
        </div>
        <div>
          <h1>
            {!data ? "Loading..." : `${data.total_paid.toLocaleString()} FIL`}
          </h1>
          <p>
            What's the sum FIL paid to store{" "}
            {!data ? "Loading..." : `${data.total_stored.toLocaleString()} GB`}{" "}
            ?
          </p>
        </div>
      </div>

      {/* Credits */}
      <div className="footer">
        <p>
          Developed by{" "}
          <a
            href="https://anishagnihotri.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Anish Agnihotri
          </a>
          .
        </p>
        <p>Data samples most recent 2,500 deals.</p>
        <p>
          Data (RPC) retrieved from{" "}
          <a
            href="https://filscan.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Filscan
          </a>
          .
        </p>
      </div>

      {/* Scoped styles */}
      <style jsx>
        {`
          .card {
            background-color: #fff;
            display: inline-block;
            border-radius: 5px;
            border: 1px solid #e7eaf3;
            box-shadow: 0 0 35px rgba(127, 150, 174, 0.125);
          }
          .item {
            display: inline-block;
            width: calc(50% - 17px);
            margin: 15px 0px;
            vertical-align: top;
          }
          .item:nth-of-type(even) {
            margin-right: 15px;
          }
          .item:nth-of-type(odd) {
            margin-left: 15px;
          }
          .item > div:nth-child(1) {
            padding: 10px 20px;
            border-bottom: 1px solid #e7eaf3;
            text-align: left;
          }
          .item > div:nth-child(1) > span {
            font-weight: bold;
            color: #556adc;
          }
          .item > div:nth-child(2) {
            padding: 10px 20px;
            text-align: center;
          }
          .item > div:nth-child(2) > h1 {
            font-size: 42px;
            margin: 20px 0px;
          }
          .item > div:nth-child(2) > p {
            color: #98a5cd;
            line-height: 150%;
            margin: 0px 0px 10px 0px;
          }
          .header {
            width: 100%;
            padding: 12.5px 0px;
          }
          .footer {
            padding-top: 30px;
          }
          .footer > p {
            font-size: 14px;
            margin: 10px;
            color: #8797c5;
          }
          .footer > p > a {
            color: #556adc;
            transition: 50ms ease-in-out;
          }
          .footer > p > a:hover {
            opacity: 0.7;
          }
          .status-light {
            height: 8px;
            width: 8px;
            display: inline-block;
            border-radius: 50%;
            transform: scale(1);
            vertical-align: middle;
            margin-right: 5px;
            margin-top: -2px;
            background-color: rgb(0, 190, 0);
            box-shadow: 0 0 0 0 rgba(0, 190, 0, 1);
            animation: pulsegreen 2s infinite;
          }
          @keyframes pulsegreen {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(0, 190, 0, 0.7);
            }
          
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 5px rgba(0, 190, 0, 0);
            }
          
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(0, 190, 0, 0);
            }
          }
          @media screen and (max-width: 1050px) {
          .item {
            width: calc(100% - 2px);
            margin: 15px 0px !important;
          }
        `}
      </style>
    </Layout>
  );
}
