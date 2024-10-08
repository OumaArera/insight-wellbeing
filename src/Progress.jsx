import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import CryptoJS from 'crypto-js';
import logoImage from './logo.png';

const IMPRESSION_URL = "https://insight-backend-g7dg.onrender.com/users/get/impression";
const PRESCRIPTION_URL = "https://insight-backend-g7dg.onrender.com/users/get/prescription";
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const Progress = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [impression, setImpression] = useState([]);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [error, setError] = useState("");
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("userData");

    if (accessToken) setToken(JSON.parse(accessToken));
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserId(parsedData.userId);
      setPatientName(`${parsedData.firstName} ${parsedData.lastName}`);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      getImpression();
      getPrescription();
    }
  }, [userId]);

  const getPrescription = async () => {
    if (!token || !userId) return;

    try {
      const response = await fetch(`${PRESCRIPTION_URL}/${userId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (result.successful) {
        const decryptedBytes = CryptoJS.AES.decrypt(result.ciphertext, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
          iv: CryptoJS.enc.Hex.parse(result.iv),
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC
        });
        let decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
        decryptedData = decryptedData.replace(/\0+$/, '');
        const userData = JSON.parse(decryptedData);
        setPrescriptions(userData);
      } else {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      setError(`There was an error getting the data. Error ${error}`);
      setTimeout(() => setError(""), 5000);
    }
  };

  const getImpression = async () => {
    if (!token || !userId) return;

    try {
      const response = await fetch(`${IMPRESSION_URL}/${userId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (result.successful) {
        const decryptedBytes = CryptoJS.AES.decrypt(result.ciphertext, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
          iv: CryptoJS.enc.Hex.parse(result.iv),
          padding: CryptoJS.pad.Pkcs7,
          mode: CryptoJS.mode.CBC
        });
        let decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
        decryptedData = decryptedData.replace(/\0+$/, '');
        const userData = JSON.parse(decryptedData);
        setImpression(userData);
      } else {
        setError(result.message);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      setError(`There was an error getting the data. Error ${error}`);
      setTimeout(() => setError(""), 5000);
    }
  };

  // Update dataFetched state once both prescriptions and impression data are fetched
  useEffect(() => {
    if (prescriptions.length > 0 || impression.length > 0) {
      setDataFetched(true);
    }
  }, [prescriptions, impression]);

  const generatePrescriptionPDF = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.setTextColor(255, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Serenity Pathways", 105, 15, null, null, 'center');

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(0, 0, 0);
    pdf.text("Mindful Horizons", 105, 22, null, null, 'center');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 105, 29, null, null, 'center');

    const logoWidth = 20;
    const logoHeight = 20;
    pdf.addImage(logoImage, 'JPEG', 20, 10, logoWidth, logoHeight);

    prescriptions.forEach((prescription, index) => {
      if (index > 0) pdf.addPage();
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Patient's Name: ${patientName}`, 10, 50);

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Prescription: ${prescription.prescription}`, 10, 60);

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Doctor's Name: Dr. ${prescription.doctorName}`, 10, 80);
      pdf.text(`Date: ${new Date(prescription.date).toLocaleDateString()}`, 10, 90);
    });

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Learn to choose the way you feel…", 105, 250, null, null, 'center');
    pdf.text("https://insight-wellbeing.vercel.app/", 105, 260, null, null, 'center');

    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text("This prescription is electronically generated and does not require a stamp.", 105, 270, null, null, 'center');

    pdf.save('Prescriptions.pdf');
  };

  const generateImpressionPDF = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.setTextColor(255, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Serenity Pathways", 105, 15, null, null, 'center');

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(0, 0, 0);
    pdf.text("Mindful Horizons", 105, 22, null, null, 'center');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 105, 29, null, null, 'center');

    const logoWidth = 20;
    const logoHeight = 20;
    pdf.addImage(logoImage, 'JPEG', 20, 10, logoWidth, logoHeight);

    impression.forEach((impress, index) => {
      if (index > 0) pdf.addPage();
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Patient's Name: ${patientName}`, 10, 50);

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Impression: ${impress.prescription}`, 10, 60);

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Doctor's Name: Dr. ${impress.doctorName}`, 10, 80);
      pdf.text(`Date: ${new Date(impress.date).toLocaleDateString()}`, 10, 90);
    });

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Learn to choose the way you feel…", 105, 250, null, null, 'center');
    pdf.text("https://insight-wellbeing.vercel.app/", 105, 260, null, null, 'center');

    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text("This impression is electronically generated and does not require a stamp.", 105, 270, null, null, 'center');

    pdf.save('Impressions.pdf');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Progress</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <button
          className={`py-2 px-4 rounded ${prescriptions.length > 0 ? 'bg-blue-500 text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
          onClick={generatePrescriptionPDF}
          disabled={prescriptions.length === 0}
        >
          Prescriptions PDF
        </button>
        <button
          className={`py-2 px-4 rounded ${impression.length > 0 ? 'bg-green-500 text-white hover:bg-green-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
          onClick={generateImpressionPDF}
          disabled={impression.length === 0}
        >
          Impressions PDF
        </button>
      </div>
    </div>
  );
  
};

export default Progress;
