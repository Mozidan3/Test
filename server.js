const express = require("express");
const geoip = require("geoip-lite");
const useragent = require("express-useragent");
const fs = require("fs"); // إضافة مكتبة FS

const app = express();
app.use(express.json());
app.use(useragent.express());

// Endpoint لجمع البيانات
app.post("/track", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const geo = geoip.lookup(ip) || {};

  const collectedData = {
    ip,
    location: geo,
    deviceInfo: req.body.deviceInfo,
    geolocation: req.body.geolocation,
    network: req.body.network,
    mediaAccess: req.body.media,
    mouseMovements: req.body.mouseMovements,
    activity: req.body.activity,
    timestamp: new Date().toISOString(),
    userAgent: req.useragent,
  };

  // طباعة البيانات في الـ Console
  console.log("Collected Data:", collectedData);

  // حفظ البيانات في ملف JSON
  fs.appendFile("data.json", JSON.stringify(collectedData, null, 2) + ",\n", (err) => {
    if (err) console.error("Error saving data:", err);
    else console.log("Data saved to file!");
  });

  res.json({ status: "success", collectedData });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));