const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

router.get("/", (req, res) => {
  exec("nmap -sn 192.168.0.0/24", (error, stdout) => {
    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    const devices = [];

    const blocks = stdout.split("Nmap scan report for");

    for (const block of blocks) {
      const ipMatch = block.match(
        /(\d+\.\d+\.\d+\.\d+)/
      );

      if (ipMatch) {
        devices.push({
          ip: ipMatch[1]
        });
      }
    }

    res.json(devices);
  });
});

module.exports = router;