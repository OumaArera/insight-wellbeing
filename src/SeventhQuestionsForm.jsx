import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const PATIENT_HISTORY_URL = "https://insight-backend-g7dg.onrender.com/users/patient-history";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const SeventhQuestionsForm = () => {
  const [formData, setFormData] = useState({
    pleasantImage: '',
    unpleasantImage: '',
    safePlace: '',
    disturbingImages: '',
    nightmaresFrequency: '',
    thoughts: {
      intelligent: false,
      confident: false,
      anxious: false,
      guilty: false,
      paranoid: false,
      confused: false,
      hostile: false,
      depressed: false,
      psychotic: false,
      angry: false,
      perfectionistic: false,
      ashamed: false,
      insecure: false,
      suicidal: false,
      lonely: false,
      impulsive: false,
      grandiose: false,
      religious: false,
      magical: false,
      mystical: false,
      nihilistic: false,
      delusions: false,
      hallucinations: false,
      obsessions: false,
      compulsions: false,
      dissociative: false,
      hypochondriacal: false,
      phobic: false,
      somatic: false,
      otherThoughts: '',
    },
    botheredByThoughts: '',
    botheredThoughtsDescription: '',
    negativeWorries: '',
    opinionStatements: {
      mistakes: '',
      friendships: '',
      datingHighSchool: '',
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
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        thoughts: {
          ...formData.thoughts,
          [name]: checked,
        },
      });
    } else if (type === 'radio') {
      if (name === 'bothered') {
        setFormData({
          ...formData,
          botheredByThoughts: value === 'Yes' ? true : false,
        });
      } else {
        setFormData({
          ...formData,
          opinionStatements: {
            ...formData.opinionStatements,
            [name]: value,
          },
        });
      }
    } else if (name === 'otherThoughts') {
      setFormData({
        ...formData,
        thoughts: {
          ...formData.thoughts,
          otherThoughts: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const currentDate = new Date().toISOString();

    const dataToSend = {
      userId: userId,
      pageNo: 7,
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
          <h2 className="text-xl font-bold mb-2">Image 1</h2>
          <label className="block mb-2">Describe a very pleasant image, mental picture, or fantasy:</label>
          <textarea
            name="pleasantImage"
            value={formData.pleasantImage}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Describe a very unpleasant image, mental picture, or fantasy:</label>
          <textarea
            name="unpleasantImage"
            value={formData.unpleasantImage}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Describe your image of a completely “safe place”:</label>
          <textarea
            name="safePlace"
            value={formData.safePlace}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">Describe any persistent or disturbing images that interfere with your daily functioning:</label>
          <textarea
            name="disturbingImages"
            value={formData.disturbingImages}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">How often do you have nightmares?</label>
          <input
            type="text"
            name="nightmaresFrequency"
            value={formData.nightmaresFrequency}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Thoughts</h2>
          <label className="block mb-2">Check each of the following that you might use to describe yourself:</label>
          {Object.keys(formData.thoughts).map((thought, index) => (
            <div key={index} className="mb-2">
              <input
                type="checkbox"
                name={thought}
                checked={formData.thoughts[thought]}
                onChange={handleChange}
                className="mr-2"
              />
              <label>{thought.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
            </div>
          ))}
          <label className="block mb-2">What do you consider to be your craziest thought or idea?</label>
          <textarea
            name="otherThoughts"
            value={formData.thoughts.otherThoughts}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Image 2</h2>
          <label className="block mb-2">Are you bothered by thoughts that occur over and over again?</label>
          <div className="mb-2">
            <input
              type="radio"
              name="bothered"
              value="Yes"
              checked={formData.botheredByThoughts === true}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-4">Yes</label>
            <input
              type="radio"
              name="bothered"
              value="No"
              checked={formData.botheredByThoughts === false}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
          </div>
          {formData.botheredByThoughts && (
            <div className="mb-2">
              <label className="block mb-2">If yes, what are these thoughts?</label>
              <textarea
                name="botheredThoughtsDescription"
                value={formData.botheredThoughtsDescription}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
              />
            </div>
          )}
          <label className="block mb-2">What worries do you have that may negatively affect your mood or behavior?</label>
          <textarea
            name="negativeWorries"
            value={formData.negativeWorries}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Opinion Statements</h2>
          <label className="block mb-2">On each of the following items, please mark the number that most accurately reflects your opinions:</label>
          <div className="mb-2">
            <label className="block mb-1">Mistakes:</label>
            <input
              type="radio"
              name="mistakes"
              value={formData.opinionStatements.mistakes}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-2">1 (Strongly Disagree)</label>
            <input
              type="radio"
              name="mistakes"
              value={formData.opinionStatements.mistakes}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-2">2 (Disagree)</label>
            <input
              type="radio"
              name="mistakes"
              value={formData.opinionStatements.mistakes}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-2">3 (Neutral)</label>
            <input
              type="radio"
              name="mistakes"
              value={formData.opinionStatements.mistakes}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-2">4 (Agree)</label>
            <input
              type="radio"
              name="mistakes"
              value={formData.opinionStatements.mistakes}
              onChange={handleChange}
              className="mr-2"
            />
            <label>5 (Strongly Agree)</label>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Friendships:</label>
            <input
              type="radio"
              name="friendships"
              value={formData.opinionStatements.friendships}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-2">1 (Strongly Disagree)</label>
            <input
              type="radio"
              name="friendships"
              value={formData.opinionStatements.friendships}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-2">2 (Disagree)</label>
            <input
              type="radio"
              name="friendships"
              value={formData.opinionStatements.friendships}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-2">3 (Neutral)</label>
            <input
              type="radio"
              name="friendships"
              value={formData.opinionStatements.friendships}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-2">4 (Agree)</label>
            <input
              type="radio"
              name="friendships"
              value={formData.opinionStatements.friendships}
              onChange={handleChange}
              className="mr-2"
            />
            <label>5 (Strongly Agree)</label>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Did you date much during high school?</label>
            <input
              type="radio"
              name="date_highschool"
              value={formData.opinionStatements.date_highschool}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-2">1 (Strongly Disagree)</label>
            <input
              type="radio"
              name="date_highschool"
              value={formData.opinionStatements.date_highschool}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-2">2 (Disagree)</label>
            <input
              type="radio"
              name="date_highschool"
              value={formData.opinionStatements.date_highschool}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-2">3 (Neutral)</label>
            <input
              type="radio"
              name="date_highschool"
              value={formData.opinionStatements.date_highschool}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="mr-2">4 (Agree)</label>
            <input
              type="radio"
              name="date_highschool"
              value={formData.opinionStatements.date_highschool}
              onChange={handleChange}
              className="mr-2"
            />
            <label>5 (Strongly Agree)</label>
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

export default SeventhQuestionsForm;
