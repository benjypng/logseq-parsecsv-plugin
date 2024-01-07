import React from "react";

type ProgressBarProps = {
  progressPercentage: number;
};

const ProgressBar = ({ progressPercentage }: ProgressBarProps) => {
  return (
    <React.Fragment>
      {progressPercentage !== 0 && (
        <p className="text-right text-sm">{progressPercentage.toFixed(2)}%</p>
      )}
      {progressPercentage !== 0 && (
        <div className="h-2 w-full bg-gray-300">
          <div
            style={{ width: `${progressPercentage}%` }}
            className={`h-full ${
              progressPercentage < 70 ? "bg-yellow-300" : "bg-green-600"
            }`}
          ></div>
        </div>
      )}
    </React.Fragment>
  );
};

export default ProgressBar;
