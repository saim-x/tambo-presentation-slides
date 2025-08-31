"use client"
import { Cloud, Sun, CloudRain, Thermometer, Wind } from "lucide-react"


interface WeatherCardProps {
    city: string;
    temperature: number;
    condition: "sunny" | "cloudy" | "rainy";
    humidity: number;
}

export default function WeatherCard(
    { city, temperature, condition, humidity }: WeatherCardProps) {
    const getIcon = () => {
        switch (condition) {
            case "sunny": return <Sun className="w4 h-8 text-yellow-500" />;
            case "cloudy": return <Cloud className="w4 h-8 text-gray-500" />;
            case "rainy": return <CloudRain className="w4 h-8 text-blue-500" />;
        }
    };
    return (
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow-lg max-w-sm">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{city}</h2>
                {getIcon()}
            </div>
            <div className="text-3xl font-bold mb-2">
                {temperature} °C
            </div>
            <div className="flex items-center gap-2 text-blue-100">
                <Thermometer className="w-4 h-4" />
                <span>Humidity: {humidity}%</span>
            </div>
        </div>
    );
}