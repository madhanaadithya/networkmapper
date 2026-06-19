import { useEffect, useState } from "react";
import axios from "axios";

import './index.css'
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
  const [ports, setPorts] = useState([]);
const [portLoading, setPortLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const handleDeviceClick = (device: Device) => {
  setSelectedDevice(device);
  setPorts([]);
};
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
const scanPorts = async (ip: string) => {
  try {
    setPortLoading(true);

    const res = await axios.get(
      `http://localhost:5000/api/ports/${ip}`
    );

    setPorts(res.data);
  } catch (err) {
    console.error(err);
  } finally {
    setPortLoading(false);
  }
};
  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="mb-8">
  <h1 className="text-4xl font-bold">
    NetSight
  </h1>

  <p className="text-zinc-400">
    Real-time network discovery dashboard
  </p>
</div>

      <div className="grid grid-cols-2 gap-4 mb-6">
  <div className="bg-zinc-900 rounded-xl p-4">
    <h3 className="text-zinc-400">
      Devices Found
    </h3>

    <p className="text-3xl font-bold">
      {devices.length}
    </p>
  </div>

  <div className="bg-zinc-900 rounded-xl p-4">
    <h3 className="text-zinc-400">
      Last Scan
    </h3>

    <p className="text-xl font-bold">
      {lastScan || "Never"}
    </p>
  </div>
</div>
      <button
        onClick={fetchDevices}
        disabled={loading}
        className="
px-4 py-2
rounded-xl
bg-blue-600
hover:bg-blue-500
transition
font-medium
"
      >
        {loading
          ? "Scanning..."
          : "Scan Network"}
      </button>

      <br />
      <br />

      <div className="grid gap-3">
  {devices.map((device, index) => (
    <div
      key={index}
      onClick={() => {
        setSelectedDevice(device);
        setPorts([]);
      }}
      className="
        bg-zinc-900
        hover:bg-zinc-800
        p-4
        rounded-xl
        cursor-pointer
        transition
      "
    >
      <div className="flex justify-between">
        <div
        className="
bg-zinc-900
hover:bg-zinc-800
border
border-zinc-800
hover:border-blue-500
rounded-xl
p-4
cursor-pointer
transition
">
          <h3 className="font-semibold">
            {device.ip}
          </h3>

          <p className="text-zinc-400">
            {device.vendor}
          </p>
        </div>

        <div className="text-green-400">
          🟢 Online
        </div>
      </div>
    </div>
  ))}
</div>
      {selectedDevice && (
  <div
  className="
  fixed inset-0
  bg-black/70
  flex
  items-center
  justify-center
"
>
  <div
    className="
    bg-zinc-900
    text-white
    rounded-2xl
    p-6
    w-[600px]
    shadow-2xl
    "
  >
      <h2>Device Details</h2>

      <div className="mb-2">
  <span className="text-zinc-500">
    IP
  </span>

  <p>{selectedDevice.ip}</p>
</div>

      <div className="mb-2">
  <span className="text-zinc-500">
    STATUS
  </span>

  <p>{selectedDevice.status}</p>
</div>

      <div className="mb-2">
  <span className="text-zinc-500">
    LATENCY
  </span>

  <p>{selectedDevice.latency}</p>
</div>

      <div className="mb-2">
  <span className="text-zinc-500">
    MAC
  </span>

  <p>{selectedDevice.mac}</p>
</div>

      <p>
        <strong>Vendor:</strong>{" "}
        {selectedDevice.vendor}
      </p>

      <button
        onClick={() =>
          setSelectedDevice(null)
        }
        className="
px-4 py-2
rounded-xl
bg-blue-600
hover:bg-blue-500
transition
font-medium
"
      >
        Close
      </button>
      <button
  onClick={() =>
    scanPorts(selectedDevice.ip)
  }

  className="
px-4 py-2
rounded-xl
bg-zinc-800
hover:bg-zinc-700
transition
"
>
  Scan Ports
</button>
{portLoading && (
  <p>Scanning ports...</p>
)}

{ports.length > 0 && (
  <table
    border={1}
    cellPadding={8}
    style={{
      marginTop: "15px",
      width: "100%"
    }}
  >
    <thead>
      <tr>
        <th>Port</th>
        <th>State</th>
        <th>Service</th>
      </tr>
    </thead>

    <tbody>
      {ports.map((port, index) => (
        <tr key={index}>
          <td>{port.port}</td>
          <td>{port.state}</td>
          <td>{port.service}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}
    </div>
  </div>
)}
    </div>
  );
}

export default App;