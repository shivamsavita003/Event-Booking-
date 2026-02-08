import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import { eventAPI } from '../services/api';
import socketService from '../services/socket';
import EventCard from './EventCard';
import { Link } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchEvents();
    
    // Connect socket for real-time updates
    socketService.connect();
    
    socketService.on('eventCreated', (newEvent) => {
      setEvents(prev => [newEvent, ...prev]);
    });
    
    socketService.on('eventUpdated', (updatedEvent) => {
      setEvents(prev => 
        prev.map(event => event._id === updatedEvent._id ? updatedEvent : event)
      );
    });
    
    socketService.on('eventDeleted', (deletedId) => {
      setEvents(prev => prev.filter(event => event._id !== deletedId));
    });

    socketService.on('bookingCreated', (data) => {
      setEvents(prev =>
        prev.map(event =>
          event._id === data.event.id
            ? { ...event, available_seats: data.event.available_seats }
            : event
        )
      );
    });
    
    return () => {
      socketService.off('eventCreated');
      socketService.off('eventUpdated');
      socketService.off('eventDeleted');
      socketService.off('bookingCreated');
    };
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchEvents();
    }, 500);
    
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, locationFilter, dateFilter, sortBy]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (searchTerm) params.search = searchTerm;
      if (locationFilter) params.location = locationFilter;
      if (dateFilter) params.date = dateFilter;
      params.sortBy = sortBy;
      
      const response = await eventAPI.getAll(params);
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const uniqueLocations = [...new Set(events.map(event => event.location))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Header */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-white">
            Event<span className="text-yellow-400">Hub</span>
          </Link>
          <div className="flex gap-4">
            <Link to="/admin" className="text-white hover:text-yellow-400 transition">
              Admin Panel
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-xl text-gray-300">
            Find and book tickets for the best events near you
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-12 border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/90 rounded-xl border-2 border-transparent focus:border-yellow-400 focus:outline-none transition-all"
              />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/90 rounded-xl border-2 border-transparent focus:border-yellow-400 focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <FaCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/90 rounded-xl border-2 border-transparent focus:border-yellow-400 focus:outline-none transition-all"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/90 rounded-xl border-2 border-transparent focus:border-yellow-400 focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Price</option>
                <option value="title">Sort by Name</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/10 rounded-2xl h-96 shimmer" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🎫</div>
            <h2 className="text-3xl font-bold text-white mb-2">No Events Found</h2>
            <p className="text-gray-300">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 text-white text-lg"
            >
              Found <span className="font-bold text-yellow-400">{events.length}</span> events
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <EventCard key={event._id} event={event} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventList;