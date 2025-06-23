import cron from "cron";
import https from "https";
import "dotenv/config";

const job = new cron.CronJob('* * * * *', function () {
    const url = process.env.API_URL;

    if (!url) {
        console.error("❌ API_URL is not defined in .env file.");
        return;
    }

    console.log("🌐 Sending GET request to:", url);

    https.get(url, (res) => {
        console.log("🔁 Status code:", res.statusCode);

        if (res.statusCode === 200) {
            console.log("✅ GET request sent successfully");
        } else {
            console.log(`⚠️ GET request failed with status code: ${res.statusCode}`);
        }

        res.on("data", (chunk) => {
            console.log("📦 Response chunk:", chunk.toString());
        });
    }).on("error", (e) => {
        console.error("❌ Cron job GET request failed:", e.message);
    });
});

export default job;
