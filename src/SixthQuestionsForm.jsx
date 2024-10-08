import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const PATIENT_HISTORY_URL = "https://insight-backend-g7dg.onrender.com/users/patient-history";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const SixthQuestionsForm = () => {
  const [formData, setFormData] = useState({
    fears: ['', '', '', '', ''],
    positiveFeelings: '',
    loseControlSituations: '',
    calmSituations: '',
    physicalSensations: {
      abdominalPain: false,
      painOrBurningWithUrination: false,
      menstrualDifficulties: false,
      headaches: false,
      dizziness: false,
      palpitations: false,
      muscleSpasms: false,
      tension: false,
      sexualDisturbances: false,
      unableToRelax: false,
      bowelDisturbances: false,
      tingling: false,
      numbness: false,
      stomachTrouble: false,
      tics: false,
      fatigue: false,
      twitches: false,
      backPain: false,
      tremors: false,
      faintingSpells: false,
      hearThings: false,
      wateryEyes: false,
      flushes: false,
      nausea: false,
      skinProblems: false,
      dryMouth: false,
      burningOrItchingSkin: false,
      chestPain: false,
      rapidHeartBeat: false,
      blackouts: false,
      excessiveSweating: false,
      visualDisturbances: false,
      hearingProblems: false,
      other: '',
    },
  });
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [successful, setSuccessful] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData).userId);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, dataset } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        physicalSensations: {
          ...formData.physicalSensations,
          [name]: checked,
        },
      });
    } else if (dataset.section) {
      setFormData({
        ...formData,
        [dataset.section]: value,
      });
    } else {
      const index = parseInt(name.replace('fear', ''), 10) - 1;
      setFormData({
        ...formData,
        fears: formData.fears.map((fear, i) => (i === index ? value : fear)),
      });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const currentDate = new Date().toISOString();

    const dataToSend = {
      userId: userId,
      pageNo: 6,
      questions: formData,
      date: currentDate
    };

    const dataStr = JSON.stringify(dataToSend);
    const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
    const encryptedData = CryptoJS.AES.encrypt(dataStr, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
      iv: CryptoJS.enc.Hex.parse(iv),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    }).toString();

    const payload = {
      iv: iv,
      ciphertext: encryptedData
    };

    try {
      const response = await fetch(PATIENT_HISTORY_URL, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.successful) {
        setSuccessful(result.message);
        setTimeout(() => setSuccessful(""), 5000);
      } else {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(`There was an error sending your data: Error: ${error}`);
      setTimeout(() => setError(""), 5000);
      
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">List your five main fears</h2>
          {formData.fears.map((fear, index) => (
            <div key={index} className="mb-2">
              <label className="block mb-1">Fear {index + 1}:</label>
              <input
                type="text"
                name={`fear${index + 1}`}
                value={fear}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Positive Feelings</h2>
          <label className="block mb-2">What are some positive feelings you have experienced recently?</label>
          <textarea
            name="positiveFeelings"
            data-section="positiveFeelings"
            value={formData.positiveFeelings}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Situations Losing Control of Feelings</h2>
          <label className="block mb-2">When are you most likely to lose control of your feelings?</label>
          <textarea
            name="loseControlSituations"
            data-section="loseControlSituations"
            value={formData.loseControlSituations}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Calm or Relaxed Situations</h2>
          <label className="block mb-2">Describe any situations that make you feel calm or relaxed:</label>
          <textarea
            name="calmSituations"
            data-section="calmSituations"
            value={formData.calmSituations}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Physical Sensations</h2>
          <label className="block mb-2">Check any of the following physical sensations that often apply to you:</label>
          {[
            'abdominalPain', 'painOrBurningWithUrination', 'menstrualDifficulties', 'headaches', 'dizziness', 'palpitations',
            'muscleSpasms', 'tension', 'sexualDisturbances', 'unableToRelax', 'bowelDisturbances', 'tingling', 'numbness',
            'stomachTrouble', 'tics', 'fatigue', 'twitches', 'backPain', 'tremors', 'faintingSpells', 'hearThings', 'wateryEyes',
            'flushes', 'nausea', 'skinProblems', 'dryMouth', 'burningOrItchingSkin', 'chestPain', 'rapidHeartBeat', 'blackouts',
            'excessiveSweating', 'visualDisturbances', 'hearingProblems'
          ].map((sensation) => (
            <div key={sensation} className="mb-2">
              <input
                type="checkbox"
                name={sensation}
                checked={formData.physicalSensations[sensation]}
                onChange={handleChange}
                className="mr-2"
              />
              <label>{sensation.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
            </div>
          ))}
          <div className="mb-2">
            <label className="block mb-1">Other (specify):</label>
            <input
              type="text"
              name="other"
              value={formData.physicalSensations.other}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        {error && (
          <div className="text-red-500 mt-2 text-sm text-center">{error}</div>
        )}
        {successful && (
          <div className="text-green-500 mt-2 text-sm text-center">{successful}</div>
        )}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-700"></div>
        </div>
      )}
    </div>
  );
};

export default SixthQuestionsForm;
