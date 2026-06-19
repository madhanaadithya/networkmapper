const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

router.get("/:ip", (req, res) => {
  const ip = req.params.ip;

  exec(`nmap -sV ${ip}`, (error, stdout) => {
    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    const ports = [];

    const lines = stdout.split("\n");

    for (const line of lines) {
      const match = line.match(
        /^(\d+\/tcp)\s+(\w+)\s+(.+)$/
      );

      if (match) {
        ports.push({
          port: match[1],
          state: match[2],
          service: match[3]
        });
      }
    }

    res.json(ports);
  });
});

module.exports = router;