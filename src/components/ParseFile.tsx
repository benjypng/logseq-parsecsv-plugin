import { ParseComponentProps } from "~/ParseCSV";

export const ParseFile = ({
  setThingToParse,
  thingToParse,
}: ParseComponentProps) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setThingToParse(e.target.files[0]);
  };

  return (
    <>
      <input
        type="file"
        onChange={handleFile}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded mb-3"
      >
        Choose File
      </label>
      {thingToParse && (
        <div className="mt-2 mb-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          Selected file: {(thingToParse as File).name}
        </div>
      )}
    </>
  );
};
