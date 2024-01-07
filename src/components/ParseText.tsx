import { ParseComponentProps } from "~/ParseCSV";

export const ParseText = ({
  setThingToParse,
  thingToParse,
}: ParseComponentProps) => {
  return (
    <>
      <textarea
        key={Date.now()}
        rows={10}
        className="border-gray-500 p-3 rounded-md mt-5 mb-3"
        onChange={(e) => setThingToParse(e.target.value)}
        placeholder="Insert CSV here"
        value={thingToParse as string}
      ></textarea>
    </>
  );
};
