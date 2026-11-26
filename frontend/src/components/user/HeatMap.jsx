import React, { useState, useEffect } from "react";
import HeatMap from "@uiw/react-heat-map";
import "./heatmap.css";

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);

  const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  const endDate = new Date();

  const generateActivityData = () => {
    const data = [];
    const curr = new Date(startDate);

    while (curr <= endDate) {
      let count = 0;

      // 75% chance of activity
      if (Math.random() < 0.75) {
        count = Math.floor(Math.random() * 4) + 1; // 1–4
      }

      data.push({
        date: curr.toISOString().split("T")[0],
        count,
      });

      curr.setDate(curr.getDate() + 1);
    }

    return data;
  };

  useEffect(() => {
    const data = generateActivityData();
    setActivityData(data);
  }, []);

  return (
    <div className="heatmap-wrapper">
      <div className="heatmap-box">

        <HeatMap
          value={activityData}
          startDate={startDate}
          endDate={endDate}

          rectSize={18}
          space={5}

          weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
          monthLabels={[
            'Jan','Feb','Mar','Apr','May','Jun',
            'Jul','Aug','Sep','Oct','Nov','Dec'
          ]}

          panelColors={{
            0: "#EDE7E0",
            1: "#c8e6c9",
            2: "#81c784",
            3: "#4CAF50",
            4: "#2E7D32",
          }}
        />
      </div>

      {/* LEGEND */}
      <div className="heatmap-legend">
        <span>Less</span>

        <div className="legend-box" style={{ background: "#161b22" }} />
        <div className="legend-box" style={{ background: "#0e4429" }} />
        <div className="legend-box" style={{ background: "#006d32" }} />
        <div className="legend-box" style={{ background: "#26a641" }} />
        <div className="legend-box" style={{ background: "#39d353" }} />

        <span>More</span>
      </div>
    </div>
  );
};

export default HeatMapProfile;