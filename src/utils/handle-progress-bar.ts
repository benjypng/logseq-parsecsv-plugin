export const handleProgressBar = (
  array: any[],
  setProgressPercentage: React.Dispatch<React.SetStateAction<number>>,
) => {
  const interval = 100 / array.length;
  setProgressPercentage((progressPercentage) => progressPercentage + interval);
};
