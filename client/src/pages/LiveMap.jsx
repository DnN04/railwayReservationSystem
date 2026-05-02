import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

// Custom icons
const createCustomIcon = (color, size) => L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; box-shadow: 0 0 15px ${color}; border: 2px solid white;"></div>`,
  iconSize: [size, size],
  iconAnchor: [size/2, size/2]
});

const stationIcon = createCustomIcon('#bc13fe', 16);
const intermediateIcon = createCustomIcon('#bc13fe', 8); // Smaller icon for intermediate stops
const trainIcon = createCustomIcon('#00f4fe', 12);

// Major Indian Cities Coordinates
const CITY_COORDS = {
  'MUMBAI': [19.0760, 72.8777],
  'DELHI': [28.7041, 77.1025],
  'PUNE': [18.5204, 73.8567],
  'BANGALORE': [12.9716, 77.5946],
  'CHENNAI': [13.0827, 80.2707],
  'KOLKATA': [22.5726, 88.3639],
  'HYDERABAD': [17.3850, 78.4867],
  'AHMEDABAD': [23.0225, 72.5714],
  'JAIPUR': [26.9124, 75.7873],
  'LUCKNOW': [26.8467, 80.9462],
  'SURAT': [21.1702, 72.8311],
  'NAGPUR': [21.1458, 79.0882],
  'INDORE': [22.7196, 75.8577],
  'BHOPAL': [23.2599, 77.4126],
  'PATNA': [25.5941, 85.1376],
  'SHIMLA': [31.1048, 77.1734],
  'KANPUR': [26.4499, 80.3319],
  'VARANASI': [25.3176, 82.9739],
  'AGRA': [27.1767, 78.0081],
  'GOA': [15.2993, 74.1240],
  'VIJAYAWADA': [16.5062, 80.6480],
  'VADODARA': [22.3072, 73.1812],
  'RATLAM': [23.3315, 75.0367],
  'KOTA': [25.2138, 75.8648],
  'PANIPAT': [29.3909, 76.9708],
  'AMBALA': [30.3782, 76.7767],
  'CHANDIGARH': [30.7333, 76.7794],
  'KALKA': [30.8386, 76.9360],
  'RENIGUNTA': [13.6358, 79.5215],
  'GUNTAKAL': [15.1674, 77.3842],
  'HUBBALLI': [15.3647, 75.1240]
};

// Known Real-World Routes
const REAL_ROUTES = {
  'MUMBAI-DELHI': ['MUMBAI', 'SURAT', 'VADODARA', 'RATLAM', 'KOTA', 'AGRA', 'DELHI'],
  'CHENNAI-DELHI': ['CHENNAI', 'VIJAYAWADA', 'NAGPUR', 'BHOPAL', 'AGRA', 'DELHI'],
  'DELHI-SHIMLA': ['DELHI', 'PANIPAT', 'AMBALA', 'CHANDIGARH', 'KALKA', 'SHIMLA'],
  'CHENNAI-GOA': ['CHENNAI', 'RENIGUNTA', 'GUNTAKAL', 'HUBBALLI', 'GOA'],
  'PUNE-BANGALORE': ['PUNE', 'HUBBALLI', 'BANGALORE']
};

// Default coordinates if city not found
const DEFAULT_SRC = [19.0760, 72.8777];
const DEFAULT_DEST = [28.7041, 77.1025];

// Auto-zoom to fit bounds component
const FitBounds = ({ source, dest }) => {
  const map = useMap();
  useEffect(() => {
    if (source && dest) {
      const bounds = L.latLngBounds([source, dest]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, source[0], source[1], dest[0], dest[1]]);
  return null;
};

// Generate quadratic bezier curve points
const generateCurve = (p0, p1, p2, numPoints = 100) => {
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = Math.pow(1 - t, 2) * p0[0] + 2 * (1 - t) * t * p1[0] + Math.pow(t, 2) * p2[0];
    const lng = Math.pow(1 - t, 2) * p0[1] + 2 * (1 - t) * t * p1[1] + Math.pow(t, 2) * p2[1];
    points.push([lat, lng]);
  }
  return points;
};

function LiveMap() {
  const location = useLocation();
  const train = location.state?.train;

  // Determine Source and Destination
  const sourceName = train?.source ? train.source.toUpperCase() : 'MUMBAI';
  const destName = train?.destination ? train.destination.toUpperCase() : 'DELHI';
  
  const sourceCoord = CITY_COORDS[sourceName] || DEFAULT_SRC;
  const destCoord = CITY_COORDS[destName] || DEFAULT_DEST;

  // Determine if we have a real route
  const routeKey1 = `${sourceName}-${destName}`;
  const routeKey2 = `${destName}-${sourceName}`;
  
  let routePath = null;
  let isRealRoute = false;

  if (REAL_ROUTES[routeKey1]) {
    routePath = REAL_ROUTES[routeKey1];
    isRealRoute = true;
  } else if (REAL_ROUTES[routeKey2]) {
    routePath = [...REAL_ROUTES[routeKey2]].reverse();
    isRealRoute = true;
  }

  let curvePoints = [];
  let intermediateStations = [];

  if (isRealRoute) {
    // Collect coordinates for the polyline
    curvePoints = routePath.map(station => CITY_COORDS[station]);
    
    // Intermediate stations are everything except the first and last
    for (let i = 1; i < routePath.length - 1; i++) {
      intermediateStations.push({ name: routePath[i], coord: CITY_COORDS[routePath[i]] });
    }
  } else {
    // Fallback: Calculate dynamic control point for curve
    const dx = destCoord[0] - sourceCoord[0];
    const dy = destCoord[1] - sourceCoord[1];
    const midX = sourceCoord[0] + dx / 2;
    const midY = sourceCoord[1] + dy / 2;
    const controlPoint = [midX - dy * 0.2, midY + dx * 0.2]; // 20% perpendicular offset

    curvePoints = generateCurve(sourceCoord, controlPoint, destCoord);

    // Pick 2 intermediate points along the curve
    intermediateStations = [
      { name: 'Transit Hub 1', coord: curvePoints[Math.floor(curvePoints.length * 0.33)] },
      { name: 'Transit Hub 2', coord: curvePoints[Math.floor(curvePoints.length * 0.66)] }
    ];
  }

  const [trainPosition, setTrainPosition] = useState(curvePoints[0]);
  const [progress, setProgress] = useState(0);

  // Animate train marker along the path
  useEffect(() => {
    let animationFrame;
    let currentStep = 0;
    const totalSteps = curvePoints.length - 1;
    const speed = isRealRoute ? 0.05 : 0.5; // adjust for animation speed (slower for real routes since fewer points)
    let direction = 1;

    const animate = () => {
      currentStep += speed * direction;
      
      // Ping-pong animation
      if (currentStep >= totalSteps) {
        currentStep = totalSteps;
        direction = -1;
      } else if (currentStep <= 0) {
        currentStep = 0;
        direction = 1;
      }

      const index = Math.floor(currentStep);
      const nextIndex = Math.min(index + 1, totalSteps);
      const t = currentStep - index;
      
      // Linear interpolation between the two closest curve points for smooth movement
      const lat = curvePoints[index][0] + (curvePoints[nextIndex][0] - curvePoints[index][0]) * t;
      const lng = curvePoints[index][1] + (curvePoints[nextIndex][1] - curvePoints[index][1]) * t;
      
      setTrainPosition([lat, lng]);
      setProgress((currentStep / totalSteps) * 100);
      
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="min-h-screen font-body-base bg-transparent text-[#e5e2e3]">
      <Navbar />

      <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto flex flex-col h-[100dvh] overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex justify-between items-end shrink-0"
        >
          <div>
            <h1 className="font-display-lg text-4xl text-white uppercase tracking-tighter mb-2">Live Tracking</h1>
            <p className="text-slate-400">
              {train?.train_name || 'Rail Bandhu Express'}: {sourceName} to {destName}
            </p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded-full border border-[#00f4fe]/30 bg-[#00f4fe]/10 text-[#00f4fe] font-data-mono text-xs uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f4fe] animate-pulse"></span>
              Live Status
            </span>
          </div>
        </motion.div>

        {/* Status Bar */}
        <motion.div 
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full h-1 bg-white/10 rounded-full mb-6 overflow-hidden relative shrink-0"
        >
          <div 
            className="h-full bg-gradient-to-r from-[#bc13fe] to-[#00f4fe] absolute left-0 top-0"
            style={{ width: `${progress}%` }}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(188,19,254,0.1)] relative z-10 min-h-0"
        >
          <MapContainer 
            center={[23.5, 75.0]} 
            zoom={5} 
            style={{ height: '100%', width: '100%', background: '#050505' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            <FitBounds source={sourceCoord} dest={destCoord} />

            {/* Curvy Route */}
            <Polyline 
              positions={curvePoints} 
              pathOptions={{ color: '#bc13fe', weight: 3, opacity: 0.5, dashArray: '5, 10' }} 
            />

            {/* Intermediate Stations */}
            {intermediateStations.map((station, idx) => (
              <Marker key={idx} position={station.coord} icon={intermediateIcon}>
                <Popup className="custom-popup">
                  <span className="font-label-caps text-[#d4c0d7] text-[10px]">{station.name}</span>
                </Popup>
              </Marker>
            ))}

            {/* Source & Destination Stations */}
            <Marker position={sourceCoord} icon={stationIcon}>
              <Popup className="custom-popup">
                <strong className="font-label-caps">{sourceName}</strong>
              </Popup>
            </Marker>
            
            <Marker position={destCoord} icon={stationIcon}>
              <Popup className="custom-popup">
                <strong className="font-label-caps">{destName}</strong>
              </Popup>
            </Marker>

            {/* Moving Train */}
            <Marker position={trainPosition} icon={trainIcon}>
              <Popup>
                <span className="font-data-mono text-[#00f4fe]">{train?.train_name || 'Rail Bandhu Exp'} (Active)</span>
              </Popup>
            </Marker>
          </MapContainer>
        </motion.div>
      </main>

      {/* Custom styles for leaflet popup in dark mode */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background-color: rgba(20, 20, 20, 0.9);
          backdrop-filter: blur(10px);
          color: white;
          border: 1px solid rgba(188, 19, 254, 0.3);
          border-radius: 12px;
        }
        .leaflet-popup-tip {
          background-color: rgba(20, 20, 20, 0.9);
        }
        .leaflet-container a {
          color: #00f4fe;
        }
      `}</style>
    </div>
  );
}

export default LiveMap;
