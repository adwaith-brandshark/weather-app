import React, { useEffect, useState } from 'react';
import Highlights from './Highlights';
import Temperature from './Temparature';
import axios from 'axios';

function Home() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [hourlyForecast, setHourlyForecast] = useState([]);

    useEffect(() => {
        const getGeoLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        fetchWeatherData(position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        console.error('Error getting geolocation:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        if (city) {
            fetchWeatherDataByCity(city);
        } else {
            getGeoLocation();
        }
    }, [city]);

    useEffect(() => {
        if (weatherData && weatherData.forecast && weatherData.forecast.forecastday.length > 0) {
            setHourlyForecast(weatherData.forecast.forecastday[0].hour);
        }
    }, [weatherData]);

    const fetchWeatherDataByCity = (cityName) => {
        axios.get(`https://api.weatherapi.com/v1/forecast.json?key=fdce2e89fcaf4175b52174000240105&q=${cityName}&days=1&aqi=no&alerts=no`)
            .then((res) => {
                setWeatherData(res.data);
                if (res.data.location) {
                    setCity(res.data.location.name);
                }
            })
            .catch((err) => {
                console.error('Error fetching weather data:', err);
            });
    };

    const fetchWeatherData = (latitude, longitude) => {
        axios.get(`https://api.weatherapi.com/v1/forecast.json?key=fdce2e89fcaf4175b52174000240105&q=${latitude},${longitude}&days=1&aqi=no&alerts=no`)
            .then((res) => {
                setWeatherData(res.data);
                if (res.data.location) {
                    setCity(res.data.location.name);
                }
            })
            .catch((err) => {
                console.error('Error fetching weather data:', err);
            });
    };

    return (
        <div className='bg-slate-800 min-h-screen flex flex-col justify-center pt-7 items-center'>
            <Temperature setCity={setCity} stats={weatherData ? {
                temp: weatherData.current.temp_c,
                condition: weatherData.current.condition.text,
                isDay: weatherData.current.is_day,
                location: weatherData.location.name,
                time: weatherData.location.localtime,
            } : {}} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full max-w-screen-xl">
                {weatherData && (
                    <>
                        <Highlights
                            stats={{
                                title: "Wind Status",
                                value: weatherData.current.wind_mph,
                                unit: "mph",
                                direction: weatherData.current.wind_dir,
                            }}
                        />
                        <Highlights
                            stats={{
                                title: "Humidity",
                                value: weatherData.current.humidity,
                                unit: "%",
                            }}
                        />
                        <Highlights
                            stats={{
                                title: "Visibility",
                                value: weatherData.current.vis_miles,
                                unit: "miles",
                            }}
                        />
                        <Highlights
                            stats={{
                                title: "Air Pressure",
                                value: weatherData.current.pressure_mb,
                                unit: "mb",
                            }}
                        />
                    </>
                )}
            </div>

            <div className="mt-8 w-full overflow-x-auto">
                <div className="flex space-x-4 p-4 overflow-y-auto" style={{ maxHeight: '300px' }}>
                    {hourlyForecast.map((hour) => (
                        <div key={hour.time_epoch} className="flex-shrink-0 w-32 sm:w-auto bg-gray-200 p-4 rounded-lg">
                            <p className="font-semibold">{hour.time.split(" ")[1]}</p>
                            <p>{hour.temp_c}°C</p>
                            <p>{hour.condition.text}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default Home;
