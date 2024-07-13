import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const FifthQuestionsForm = () => {
  const [formData, setFormData] = useState({
    talentsAndSkills: {
      specialTalents: '',
      startDoing: '',
      stopDoing: '',
      freeTimeSpent: '',
      hobbies: '',
    },
    relaxationAndWishes: {
      troubleRelaxing: '',
      troubleRelaxingExplanation: '',
      twoWishes: '',
    },
    feelings: {
      angry: false,
      fearful: false,
      happy: false,
      hopeful: false,
      bored: false,
      optimistic: false,
      annoyed: false,
      panicky: false,
      conflicted: false,
      helpless: false,
      restless: false,
      tense: false,
      sad: false,
      energetic: false,
      shameful: false,
      relaxed: false,
      lonely: false,
      depressed: false,
      envious: false,
      regretful: false,
      jealous: false,
      contented: false,
      anxious: false,
      guilty: false,
      hopeless: false,
      unhappy: false,
      excited: false,
    },
  });
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const userData = localStorage.getItem("userId");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) setUserId(JSON.parse(userData));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        feelings: {
          ...formData.feelings,
          [name]: checked,
        },
      });
    } else if (name === 'troubleRelaxing') {
      setFormData({
        ...formData,
        relaxationAndWishes: {
          ...formData.relaxationAndWishes,
          troubleRelaxing: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [e.target.dataset.section]: {
          ...formData[e.target.dataset.section],
          [name]: value,
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const dataToSend = {
      userId: userId,
      pageNo: 5,
      questions: formData
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToSend),
      secretKey
    ).toString();

    const payload={
      data:encryptedData
    };
    console.log("Collected Data:");
    Object.entries(dataToSend).forEach(([key, value]) => {
      console.log(`${key}: ${JSON.stringify(value, null, 2)}`);
    });

    console.log("Encrypted Data:");
    Object.entries(payload).forEach(([key, value]) => console.log(`${key} : ${value}`));

    fetch('/users/history/fifth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Talents and Skills</h2>
          <label className="block mb-2">What are some special talents or skills that you feel proud of?</label>
          <input
            type="text"
            name="specialTalents"
            data-section="talentsAndSkills"
            value={formData.talentsAndSkills.specialTalents}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">What would you like to start doing?</label>
          <input
            type="text"
            name="startDoing"
            data-section="talentsAndSkills"
            value={formData.talentsAndSkills.startDoing}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">What would you like to stop doing?</label>
          <input
            type="text"
            name="stopDoing"
            data-section="talentsAndSkills"
            value={formData.talentsAndSkills.stopDoing}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">How is your free time spent?</label>
          <input
            type="text"
            name="freeTimeSpent"
            data-section="talentsAndSkills"
            value={formData.talentsAndSkills.freeTimeSpent}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <label className="block mb-2">What kind of hobbies or leisure activities do you enjoy or find relaxing?</label>
          <input
            type="text"
            name="hobbies"
            data-section="talentsAndSkills"
            value={formData.talentsAndSkills.hobbies}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Relaxation and Wishes</h2>
          <label className="block mb-2">Do you have trouble relaxing or enjoying weekends and vacations?</label>
          <div className="mb-2">
            <input
              type="radio"
              name="troubleRelaxing"
              value="Yes"
              checked={formData.relaxationAndWishes.troubleRelaxing === 'Yes'}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Yes</label>
          </div>
          <div className="mb-2">
            <input
              type="radio"
              name="troubleRelaxing"
              value="No"
              checked={formData.relaxationAndWishes.troubleRelaxing === 'No'}
              onChange={handleChange}
              className="mr-2"
            />
            <label>No</label>
          </div>
          {formData.relaxationAndWishes.troubleRelaxing === 'Yes' && (
            <div>
              <label className="block mb-2">If yes, please explain:</label>
              <input
                type="text"
                name="troubleRelaxingExplanation"
                data-section="relaxationAndWishes"
                value={formData.relaxationAndWishes.troubleRelaxingExplanation}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
              />
            </div>
          )}
          <label className="block mb-2">If you could have any two wishes, what would they be?</label>
          <textarea
            name="twoWishes"
            data-section="relaxationAndWishes"
            value={formData.relaxationAndWishes.twoWishes}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Feelings</h2>
          <label className="block mb-2">Check any of the following feelings that often apply to you:</label>
          {['angry', 'fearful', 'happy', 'hopeful', 'bored', 'optimistic', 'annoyed', 'panicky', 'conflicted', 'helpless', 'restless', 'tense', 'sad', 'energetic', 'shameful', 'relaxed', 'lonely', 'depressed', 'envious', 'regretful', 'jealous', 'contented', 'anxious', 'guilty', 'hopeless', 'unhappy', 'excited'].map((feeling) => (
            <div key={feeling} className="mb-2">
              <input
                type="checkbox"
                name={feeling}
                checked={formData.feelings[feeling]}
                onChange={handleChange}
                className="mr-2"
              />
              <label>{feeling.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
            </div>
          ))}
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FifthQuestionsForm;
