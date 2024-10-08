import React, { useState, useEffect } from 'react';
import PatientHeader from './PatientHeader';
import Footer from './Footer';
import Activities from './Activities';
import HistoryComponent from './HistoryComponent';
import Progress from './Progress';
import Booking from './Booking';
import CreateSessions from './CreateSessions';
import PatientHealth from './PatientHealth';

const PatientDashboard = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleToggle = (section) => {
    if (section === 'booking') {
      setLoading(true);
      setActiveSection('booking');
    } else {
      setActiveSection(activeSection === section ? null : section);
    }
  };

  useEffect(() => {
    if (activeSection === 'booking') {
      setLoading(false);
    }
  }, [activeSection]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-red-600 to-green-500">
      <PatientHeader />
      <div className="flex flex-col md:flex-row flex-grow">
        <div className="w-full md:w-1/4 bg-gray-800 text-white p-4 flex flex-col items-center md:items-start md:justify-start space-y-4 md:space-y-0 md:space-y-4">
          <button
            onClick={() => handleToggle('activities')}
            className={`w-full py-2 px-4 rounded-lg shadow-lg ${activeSection === 'activities' ? 'bg-blue-600' : 'bg-gray-900'} hover:bg-blue-600`}
          >
            Structured Activities
          </button>
          <button
            onClick={() => handleToggle('progress')}
            className={`w-full py-2 px-4 rounded-lg shadow-lg ${activeSection === 'progress' ? 'bg-blue-600' : 'bg-gray-900'} hover:bg-blue-600`}
          >
            Progress Monitoring
          </button>
          <button
            onClick={() => handleToggle('history')}
            className={`w-full py-2 px-4 rounded-lg shadow-lg ${activeSection === 'history' ? 'bg-blue-600' : 'bg-gray-900'} hover:bg-blue-600`}
          >
            Client History
          </button>
          <button
            onClick={() => handleToggle('booking')}
            className={`w-full py-2 px-4 rounded-lg shadow-lg ${activeSection === 'booking' ? 'bg-blue-600' : 'bg-gray-900'} hover:bg-blue-600`}
          >
            Book Appointment
          </button>
          <button
            onClick={() => handleToggle('health')}
            className={`w-full py-2 px-4 rounded-lg shadow-lg ${activeSection === 'health' ? 'bg-blue-600' : 'bg-gray-900'} hover:bg-blue-600`}
          >
            Health Form
          </button>
        </div>
        <div className="flex-grow p-4 md:p-8 max-w-6xl mx-auto relative">
          <div className="bg-white rounded-lg shadow-lg overflow-y-auto" style={{ maxHeight: '70vh', minHeight: '50vh' }}>
            <div className="p-4 md:p-8">
              {show && (
                <h3 className="absolute top-4 left-0 w-full text-center text-4xl font-extrabold">
                  <span className="text-yellow-400 animate-blink">Please fill the </span>
                  <span className="text-red-600 animate-blink">Health Form</span>
                </h3>
              )}
              {activeSection === 'activities' && <Activities />}
              {activeSection === 'progress' && <Progress />}
              {activeSection === 'history' && <HistoryComponent />}
              {activeSection === 'booking' && (
                loading ? (
                  <div className="flex items-center justify-center h-screen">Loading...</div>
                ) : (
                  <CreateSessions onLoadingChange={setLoading} />
                )
              )}
              {activeSection === 'health' && <PatientHealth setMessage={setShow} />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
  
};

export default PatientDashboard;
