import React, { useState } from "react";
import "../styles/SizeGuide.css";

const SizeGuideTabs = () => {
  const [activeTab, setActiveTab] = useState("women");

  const sizeData = {
    women: [
      { size: "XS", waist: "24", hip: "34", inseam: "28", chest: "32", shoulder: "14", sleeve: "21" },
      { size: "S",  waist: "26", hip: "36", inseam: "29", chest: "34", shoulder: "14.5", sleeve: "21.5" },
      { size: "M",  waist: "28", hip: "38", inseam: "29", chest: "36", shoulder: "15", sleeve: "22" },
      { size: "L",  waist: "30", hip: "40", inseam: "29", chest: "38", shoulder: "16", sleeve: "22.5" },
      { size: "XL", waist: "32", hip: "42", inseam: "29", chest: "40", shoulder: "17", sleeve: "23" },
      { size: "2XL", waist: "34", hip: "44", inseam: "29", chest: "42", shoulder: "18", sleeve: "23.5" },
    ],
    men: [
      { size: "XS", waist: "28", hip: "36", inseam: "30", chest: "34", shoulder: "16", sleeve: "23" },
      { size: "S",  waist: "30", hip: "38", inseam: "30", chest: "36", shoulder: "17", sleeve: "23.5" },
      { size: "M",  waist: "32", hip: "40", inseam: "31", chest: "38", shoulder: "18", sleeve: "24" },
      { size: "L",  waist: "34", hip: "42", inseam: "31", chest: "40", shoulder: "19", sleeve: "24.5" },
      { size: "XL", waist: "36", hip: "44", inseam: "32", chest: "42", shoulder: "20", sleeve: "25" },
      { size: "2XL", waist: "38", hip: "46", inseam: "32", chest: "44", shoulder: "21", sleeve: "25.5" },
    ],
  };

  const renderTable = (gender) => (
    <table className="size-guide-table">
      <thead>
        <tr>
          <th>Size</th>
          <th>Waist (in)</th>
          <th>Hip (in)</th>
          <th>Inseam (in)</th>
          <th>Chest (in)</th>
          <th>Shoulder (in)</th>
          <th>Sleeve (in)</th>
        </tr>
      </thead>
      <tbody>
        {sizeData[gender].map((row, index) => (
          <tr key={index}>
            <td>{row.size}</td>
            <td>{row.waist}</td>
            <td>{row.hip}</td>
            <td>{row.inseam}</td>
            <td>{row.chest}</td>
            <td>{row.shoulder}</td>
            <td>{row.sleeve}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="size-guide-container">
      <div className="tabs">
        <button className={activeTab === "women" ? "active" : ""} onClick={() => setActiveTab("women")}>Women's Size Guide</button>
        <button className={activeTab === "men" ? "active" : ""} onClick={() => setActiveTab("men")}>Men's Size Guide</button>
      </div>
      <div className="tab-content">
        {activeTab === "women" && (
          <>
            <h3>Women's Size Chart</h3>
            {renderTable("women")}
          </>
        )}
        {activeTab === "men" && (
          <>
            <h3>Men's Size Chart</h3>
            {renderTable("men")}
          </>
        )}
      </div>
    </div>
  );
};

export default SizeGuideTabs;
