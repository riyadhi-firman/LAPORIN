import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

interface MapPickerProps {
    latitude: number | null;
    longitude: number | null;
    onChange: (lat: number, lng: number) => void;
}

function LocationMarker({ position, setPosition }: { position: [number, number] | null, setPosition: (pos: [number, number]) => void }) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function MapPicker({ latitude, longitude, onChange }: MapPickerProps) {
    const defaultCenter: [number, number] = [-6.200000, 106.816666]; // Jakarta
    const initialPosition: [number, number] | null = latitude && longitude ? [latitude, longitude] : null;
    
    const [position, setPosition] = useState<[number, number] | null>(initialPosition);

    const handlePositionChange = (pos: [number, number]) => {
        setPosition(pos);
        onChange(pos[0], pos[1]);
    };

    return (
        <div className="h-[300px] w-full rounded-md border overflow-hidden z-10">
            <MapContainer 
                center={initialPosition || defaultCenter} 
                zoom={13} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={handlePositionChange} />
            </MapContainer>
        </div>
    );
}
