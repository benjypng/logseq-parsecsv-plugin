import Papa from "papaparse";

export const papaParse = async (
  thingToParse: File | string | undefined,
): Promise<string[][] | undefined> => {
  if (thingToParse instanceof File) {
    return new Promise((resolve, reject) => {
      Papa.parse(thingToParse, {
        complete(results) {
          resolve(results.data as string[][]);
        },
        error(err) {
          reject(err);
        },
      });
    });
  } else if (typeof thingToParse == "string") {
    const results = Papa.parse(thingToParse);
    const response = results.data as string[][];
    return response;
  } else {
    throw new Error("Error parsing");
  }
};
