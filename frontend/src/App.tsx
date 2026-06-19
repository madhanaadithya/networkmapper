import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [devices, setDevices] = useState([]);
const fetchDevices = async () => {
  const res = await axios.get("http://localhost:5000/api/scan");
  setDevices(res.data);
};


  useEffect(() => {
    axios
      .get("http://localhost:5000/api/scan")
      .then((res) => {
        setDevices(res.data);
      });
  }, []);

  return (
    <div>
      <h1>Network Devices</h1>
<h2>Devices Found: {devices.length}</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>IP Address</th>
          </tr>
        </thead>

        <tbody>
          {devices.map((device, index) => (
            <tr key={index}>
              <td>{device.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={fetchDevices}>
  Scan Network
</button>
    </div>
  );
}

export default App;