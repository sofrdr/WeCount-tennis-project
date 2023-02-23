import React from "react";

const PointsList = ({ list }) => {
  return (
    <div>
      <ul>
        {list &&
          list.map((item, i) => {
            return <li key={i}>{`Point ${i + 1} : remporté par ${item}`}</li>;
          })}
      </ul>
    </div>
  );
};

export default PointsList;
