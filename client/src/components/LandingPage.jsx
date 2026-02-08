import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendar, FaMapMarkerAlt, FaTicketAlt, FaStar, FaUsers, FaTrophy } from 'react-icons/fa';

const LandingPage = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-08-15T00:00:00').getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const features = [
    { icon: <FaCalendar />, title: '100+ Events', desc: 'Diverse categories' },
    { icon: <FaUsers />, title: '50K+ Attendees', desc: 'Growing community' },
    { icon: <FaTrophy />, title: 'Top Speakers', desc: 'Industry experts' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            x: [0, -50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-white"
          >
            Event<span className="text-yellow-400">Hub</span>
          </motion.div>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex gap-6 items-center"
          >
            <Link to="/events" className="text-white hover:text-yellow-400 transition">
              Browse Events
            </Link>
            <Link to="/admin" className="text-white hover:text-yellow-400 transition">
              Admin
            </Link>
            <Link
              to="/events"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-full text-white font-semibold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Get Tickets
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="relative z-10 px-6 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full text-yellow-400 font-semibold border border-white/20">
              <FaMapMarkerAlt className="inline mr-2" />
              Worldwide Events
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
          >
            Discover. Book.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">
              Experience.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Your gateway to unforgettable experiences. Browse thousands of events,
            from tech conferences to music festivals, all in one place.
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4 justify-center mb-16">
            <Link
              to="/events"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 rounded-full text-white font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <FaTicketAlt />
              Explore Events
            </Link>
            <button className="glass px-8 py-4 rounded-full text-white font-bold text-lg hover:bg-white/20 transition-all duration-300">
              Learn More
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass p-6 rounded-2xl backdrop-blur-lg"
              >
                <div className="text-4xl text-yellow-400 mb-3">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-1">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Countdown Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-6 py-20 bg-black/20 backdrop-blur-sm"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Next Big Event In
          </h2>
          <p className="text-xl text-gray-300 mb-12">Tech Summit 2025 - August 15</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: countdown.days, label: 'Days' },
              { value: countdown.hours, label: 'Hours' },
              { value: countdown.minutes, label: 'Minutes' },
              { value: countdown.seconds, label: 'Seconds' }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="glass p-8 rounded-2xl backdrop-blur-lg"
              >
                <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-gray-300 text-lg">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-6 py-20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose EventHub?
            </h2>
            <p className="text-xl text-gray-300">
              The ultimate platform for event discovery and booking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Easy Booking',
                desc: 'Book tickets in seconds with our streamlined checkout process',
                icon: '🎫'
              },
              {
                title: 'Secure Payments',
                desc: 'Your transactions are protected with bank-level security',
                icon: '🔒'
              },
              {
                title: 'Instant Confirmation',
                desc: 'Get your tickets immediately via email and SMS',
                icon: '⚡'
              },
              {
                title: 'Best Prices',
                desc: 'No hidden fees. What you see is what you pay',
                icon: '💰'
              },
              {
                title: '24/7 Support',
                desc: 'Our team is always here to help you',
                icon: '🎯'
              },
              {
                title: 'Mobile Tickets',
                desc: 'Access your tickets anytime, anywhere on your phone',
                icon: '📱'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className="glass p-8 rounded-2xl backdrop-blur-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-6 py-20"
      >
        <div className="max-w-4xl mx-auto text-center glass p-16 rounded-3xl backdrop-blur-lg">
          <FaStar className="text-6xl text-yellow-400 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Explore Amazing Events?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of event-goers and discover your next unforgettable experience
          </p>
          <Link
            to="/events"
            className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 px-12 py-5 rounded-full text-white font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Browse All Events
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-3xl font-bold text-white mb-4">
            Event<span className="text-yellow-400">Hub</span>
          </div>
          <p className="text-gray-400 mb-6">
            Your trusted platform for event booking and discovery
          </p>
          <div className="flex justify-center gap-8 text-gray-400">
            <a href="#" className="hover:text-yellow-400 transition">About</a>
            <a href="#" className="hover:text-yellow-400 transition">Contact</a>
            <a href="#" className="hover:text-yellow-400 transition">Privacy</a>
            <a href="#" className="hover:text-yellow-400 transition">Terms</a>
          </div>
          <div className="mt-8 text-gray-500 text-sm">
            © 2025 EventHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;