const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

router.get("/", (req, res) => {
  exec("sudo nmap -sn 192.168.0.0/24", (error, stdout) => {
    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    const devices = [];

    const reports = stdout.split("Nmap scan report for");

    reports.forEach((report) => {
      const ipMatch = report.match(
        /(\d+\.\d+\.\d+\.\d+)/
      );

      const latencyMatch = report.match(
        /\(([\d.]+s) latency\)/
      );

      const macMatch = report.match(
        /MAC Address:\s([A-F0-9:]+)/i
      );

      const vendorMatch = report.match(
        /MAC Address:\s[A-F0-9:]+\s\((.*?)\)/i
      );

      if (ipMatch) {
        devices.push({
          ip: ipMatch[1],
          status: "Online",
          latency: latencyMatch
            ? latencyMatch[1]
            : "Unknown",
          mac: macMatch
            ? macMatch[1]
            : "Unknown",
          vendor: vendorMatch
            ? vendorMatch[1]
            : "Not Identified",
        });
      }
    });

    res.json(devices);
  });
});

module.exports = router;