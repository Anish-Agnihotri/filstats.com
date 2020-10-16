import axios from "axios"; // Axios for requests
import puppeteer from "puppeteer-core"; // Smaller puppeteer package for serverless
import chrome from "chrome-aws-lambda"; // Chrome defaults

// Generate HTML with injected USD / GB cost
const generateHTML = (data) => {
  return `<html>
  
    <head>
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');
      html {
        width: 1200px;
        height: 600px;
        background-image: url("https://filstats.com/dynamic-bg.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
      }

      .content {
        width: 1200px;
        height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .content h1 {
        max-width: 550px;
        margin: 0px auto;
        color: #fff;
        font-size: 115px;
        font-family: 'Montserrat', sans-serif;
        display: flex;
      }
      </style>
    </head>
    <div class="content">
      <center>
        <h1>$${data}</h1>
      </center>
    </div>
  </html>`;
};

// Get screenshot of page
const getScreenshot = async function ({ html, type = "png" }) {
  // Launch puppeteer Chrome
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: false,
  });

  // New page and wait for load
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle2" });
  const element = await page.$("html");

  // Screenshot
  return await element.screenshot({ type }).then(async (data) => {
    // And close browser
    await browser.close();
    return data;
  });
};

// --> /api/meta
export default async (req, res) => {
  // Hit /api/collect
  await axios
    .get("https://filstats.com/api/collect")
    .then(async (response) => {
      // Get cost to store GB on Filecoin
      const cost_per_gb = response.data.cost_per_gb.toFixed(3);
      // Pipe to generateHTML to create image
      const html = generateHTML(cost_per_gb);
      // Collect screenshot of page
      const result = await getScreenshot({ html });

      // Return dynamic image
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(result);
    })
    // If endpoint doesn't respond
    .catch(async () => {
      // Collect default meta image from /public
      const imageResp = await axios.get("https://filstats.com/meta.png", {
        responseType: "arraybuffer",
      });
      // Pipe arraybuffer into PNG
      const image = Buffer.from(imageResp.data, "base64");

      // Return static image
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(image);
    });
};
