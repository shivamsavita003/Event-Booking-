
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt, FaUsers, FaClock, FaDollarSign, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import { eventAPI, bookingAPI } from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    quantity: 1
  });

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getById(id);
      setEvent(response.data.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setBookingStatus('loading');
      
      const bookingData = {
        event_id: event._id,
        ...formData,
        quantity: parseInt(formData.quantity)
      };
      
      const response = await bookingAPI.create(bookingData);
      
      if (response.data.success) {
        setBookingStatus('success');
        // Update event seats
        setEvent(prev => ({
          ...prev,
          available_seats: prev.available_seats - parseInt(formData.quantity)
        }));
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          mobile: '',
          quantity: 1
        });
        
        setTimeout(() => setBookingStatus(null), 5000);
      }
    } catch (error) {
      setBookingStatus('error');
      setTimeout(() => setBookingStatus(null), 5000);
      console.error('Booking error:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalAmount = event ? event.price * formData.quantity : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-2xl">Event not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Header */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-white">
            Event<span className="text-yellow-400">Hub</span>
          </Link>
          <Link to="/events" className="flex items-center gap-2 text-white hover:text-yellow-400 transition">
            <FaArrowLeft />
            Back to Events
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Event Image */}
            <div className="rounded-2xl overflow-hidden mb-6 shadow-2xl">
              <img
                src={event.img}
                alt={event.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Event Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h1 className="text-4xl font-bold text-white mb-6">{event.title}</h1>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-200">
                  <FaCalendarAlt className="text-yellow-400 mr-4 text-xl" />
                  <div>
                    <div className="font-semibold">Date & Time</div>
                    <div className="text-sm">{formatDate(event.date)}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-200">
                  <FaMapMarkerAlt className="text-red-400 mr-4 text-xl" />
                  <div>
                    <div className="font-semibold">Location</div>
                    <div className="text-sm">{event.location}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-200">
                  <FaDollarSign className="text-green-400 mr-4 text-xl" />
                  <div>
                    <div className="font-semibold">Price per Ticket</div>
                    <div className="text-sm">${event.price}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-200">
                  <FaUsers className="text-blue-400 mr-4 text-xl" />
                  <div>
                    <div className="font-semibold">Available Seats</div>
                    <div className="text-sm">{event.available_seats} / {event.total_seats}</div>
                  </div>
                </div>
              </div>

              {/* Availability Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Availability</span>
                  <span>{Math.round((event.available_seats / event.total_seats) * 100)}%</span>
                </div>
                <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(event.available_seats / event.total_seats) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
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

              <div className="border-t border-white/20 pt-6">
                <h3 className="text-xl font-bold text-white mb-3">About This Event</h3>
                <p className="text-gray-300 leading-relaxed">{event.description}</p>
              </div>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-2xl sticky top-24">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Book Your Tickets</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Number of Tickets</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    max={event.available_seats}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition"
                  />
                </div>

                {/* Total Amount */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Price per ticket</span>
                    <span className="font-semibold">${event.price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Quantity</span>
                    <span className="font-semibold">× {formData.quantity}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">Total Amount</span>
                      <span className="text-2xl font-bold text-purple-600">${totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={bookingStatus === 'loading' || event.available_seats === 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    event.available_seats === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl'
                  }`}
                >
                  {bookingStatus === 'loading' ? (
                    <>
                      <FaClock className="animate-spin" />
                      Processing...
                    </>
                  ) : event.available_seats === 0 ? (
                    'Sold Out'
                  ) : (
                    <>
                      <FaTicketAlt />
                      Confirm Booking
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success/Error Notification */}
      <AnimatePresence>
        {bookingStatus && bookingStatus !== 'loading' && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className={`${
              bookingStatus === 'success' 
                ? 'bg-green-500' 
                : 'bg-red-500'
            } text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4`}>
              {bookingStatus === 'success' ? (
                <>
                  <FaCheckCircle className="text-3xl" />
                  <div>
                    <div className="font-bold text-lg">Booking Confirmed!</div>
                    <div className="text-sm">Check your email for ticket details</div>
                  </div>
                </>
              ) : (
                <>
                  <FaTimesCircle className="text-3xl" />
                  <div>
                    <div className="font-bold text-lg">Booking Failed</div>
                    <div className="text-sm">Please try again or contact support</div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventDetails;