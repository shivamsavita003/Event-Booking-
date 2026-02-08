import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt, FaUsers } from 'react-icons/fa';

const EventCard = ({ event, index }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <motion.img
          src={event.img}
          alt={event.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Price Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
          className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg"
        >
          ${event.price}
        </motion.div>

        {/* Seats Badge */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <FaUsers className="text-xs" />
          {event.available_seats} seats left
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
          {event.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-gray-700">
            <FaCalendarAlt className="text-purple-500 mr-3" />
            <span className="text-sm">{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <FaMapMarkerAlt className="text-red-500 mr-3" />
            <span className="text-sm">{event.location}</span>
          </div>

          <div className="flex items-center text-gray-700">
            <FaTicketAlt className="text-green-500 mr-3" />
            <span className="text-sm">
              {event.available_seats}/{event.total_seats} seats available
            </span>
          </div>
        </div>

        {/* Availability Bar */}
        <div className="mb-4">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${(event.available_seats / event.total_seats) * 100}%` 
              }}
              transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
              className={`h-full rounded-full ${
                event.available_seats / event.total_seats > 0.5
                  ? 'bg-green-500'
                  : event.available_seats / event.total_seats > 0.2
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
            />
          </div>
        </div>

        {/* Book Button */}
        <Link to={`/events/${event._id}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FaTicketAlt />
            View Details & Book
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;