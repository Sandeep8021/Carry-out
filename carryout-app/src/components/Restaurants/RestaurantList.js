import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import Layout from '../Layout/Layout';
import { FaSpinner } from 'react-icons/fa';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });
        fetchNearbyRestaurants(latitude, longitude); // Fetch nearby restaurants
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Could not get your location. Showing default restaurants.');
      }
    );
  }, []);

  const fetchNearbyRestaurants = (lat, lon) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('authToken');
    console.log(token)
    axios
      .get(`http://localhost:8081/api/restaurants/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRestaurants(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching nearby restaurants:', error);
        setError('Error fetching nearby restaurants.');
        setLoading(false);
      });
  };

  const handleRestaurantClick = (restaurantId) => {
    // Redirect to the Menu component and pass restaurantId as a parameter
    navigate(`/restaurants/${restaurantId}/menu`);
  };

  return (
    <Layout>
      <div className="container mx-auto mt-8">
        {/* Search form */}
        {loading ? (
          <div className="flex justify-center mt-8">
            <FaSpinner className="text-4xl text-black animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="border rounded-lg shadow-lg p-4 bg-white cursor-pointer"
                  onClick={() => handleRestaurantClick(restaurant.id)} // Add onClick event
                >
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <h3 className="text-lg font-bold mt-2">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600">{restaurant.type}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 col-span-full">
                No restaurants found.
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RestaurantList;
