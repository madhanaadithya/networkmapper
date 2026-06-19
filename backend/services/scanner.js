router.get("/", async (req, res) => {
  const devices = await scanNetwork();
  res.json(devices);
});
