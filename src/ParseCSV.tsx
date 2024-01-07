import { useState } from "react";
import ProgressBar from "./ProgressBar";
import { ParseFile } from "./components/ParseFile";
import { ParseText } from "./components/ParseText";
import { insertRendered } from "./utils/insert-rendered";
import { insertMarkdown } from "./utils/insert-markdown";
import { insertInline } from "./utils/insert-inline";
import "./tailwind.css";

export type ParseComponentProps = {
  setThingToParse: React.Dispatch<
    React.SetStateAction<File | string | undefined>
  >;
  thingToParse: File | string | undefined;
};

const ParseCSV = () => {
  const [thingToParse, setThingToParse] = useState<File | string | undefined>();
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [isParseFile, setIsParseFile] = useState<boolean>(true);

  const handleToggle = () => {
    setIsParseFile(isParseFile ? false : true);
    setThingToParse(undefined);
  };

  return (
    <div className="flex justify-center border" tabIndex={-1}>
      <div className="absolute top-10 bg-white rounded-lg p-3 w-1/2 border flex flex-col">
        <label htmlFor="toggle" className="text-sm mb-3">
          <input
            className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
            id="toggle"
            type="checkbox"
            onChange={handleToggle}
          />
          {isParseFile ? "Parse CSV" : "Parse File"}
        </label>
        {isParseFile && (
          <ParseFile
            setThingToParse={setThingToParse}
            thingToParse={thingToParse}
          />
        )}
        {!isParseFile && (
          <ParseText
            setThingToParse={setThingToParse}
            thingToParse={thingToParse}
          />
        )}

        <div className="flex gap-3 mb-5 justify-between">
          <button
            name="rendered"
            type="button"
            className="text-sm py-2 px-4 bg-teal-600 hover:bg-blue-700 focus:ring-pink-500 focus:ring-offset-pink-200 text-white w-full transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            onClick={() =>
              insertRendered(
                thingToParse,
                setProgressPercentage,
                setThingToParse,
              )
            }
          >
            To Rendered Table
          </button>
          <button
            name="markdown"
            type="button"
            className="text-sm py-2 px-4 bg-purple-800 hover:bg-blue-700 focus:ring-pink-500 focus:ring-offset-pink-200 text-white w-full transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            onClick={() =>
              insertMarkdown(
                thingToParse,
                setProgressPercentage,
                setThingToParse,
              )
            }
          >
            To Markdown Table
          </button>
          <button
            name="inline"
            type="button"
            className="text-sm py-2 px-4 bg-green-800 hover:bg-blue-700 focus:ring-pink-500 focus:ring-offset-pink-200 text-white w-full transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            onClick={() =>
              insertInline(thingToParse, setProgressPercentage, setThingToParse)
            }
          >
            Inline
          </button>
        </div>

        <ProgressBar progressPercentage={progressPercentage} />
      </div>
    </div>
  );
};

export default ParseCSV;
