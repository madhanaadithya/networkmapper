import { useEffect, useState } from "react";
import axios from "axios";

interface Device {
  ip: string;
  status: string;
  latency: string;
  mac: string;
  vendor: string;
}

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastScan, setLastScan] = useState("");

  const fetchDevices = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/scan"
      );

      setDevices(res.data);

      setLastScan(
        new Date().toLocaleTimeString()
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Network Scanner Dashboard</h1>

      <h3>Devices Found: {devices.length}</h3>

      <p>
        Last Scan: {lastScan || "Never"}
      </p>

      <button
        onClick={fetchDevices}
        disabled={loading}
      >
        {loading
          ? "Scanning..."
          : "Scan Network"}
      </button>

      <br />
      <br />

      <table
        border={1}
        cellPadding={10}
        style={{
          borderCollapse: "collapse",
          width: "100%",
        }}
      >
        <thead>
          <tr>
            <th>IP Address</th>
            <th>Status</th>
            <th>Latency</th>
            <th>MAC Address</th>
            <th>Vendor</th>
          </tr>
        </thead>

        <tbody>
          {devices.map((device, index) => (
            <tr key={index}>
              <td>{device.ip}</td>
              <td>{device.status}</td>
              <td>{device.latency}</td>
              <td>{device.mac}</td>
              <td>{device.vendor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;