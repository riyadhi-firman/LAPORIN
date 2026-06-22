import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

interface MapViewProps {
    latitude: number;
    longitude: number;
}

export default function MapView({ latitude, longitude }: MapViewProps) {
    const position: [number, number] = [latitude, longitude];

    return (
        <div className="h-[300px] w-full rounded-md border overflow-hidden z-10">
            <MapContainer 
                center={position} 
                zoom={15} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}></Marker>
            </MapContainer>
        </div>
    );
}
