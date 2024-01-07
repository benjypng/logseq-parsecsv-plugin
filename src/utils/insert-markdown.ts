import { handleProgressBar } from "./handle-progress-bar";
import { papaParse } from "./papa-parse";

export const insertMarkdown = async (
  thingToParse: File | string | undefined,
  setProgressPercentage: React.Dispatch<React.SetStateAction<number>>,
  setThingToParse: React.Dispatch<
    React.SetStateAction<File | string | undefined>
  >,
) => {
  try {
    const response = await papaParse(thingToParse);
    if (!response) return;

    let markdownTable = "";
    for (const r of response) {
      handleProgressBar(response, setProgressPercentage);
      const tmpVar = `|${r.join("|")}|`;
      markdownTable = `${markdownTable}
${tmpVar}`;
    }
    await logseq.Editor.insertAtEditingCursor(markdownTable);
    logseq.hideMainUI();
    setThingToParse(undefined);
  } catch (error) {
    console.error(error);
    await logseq.UI.showMsg("Error parsing and inserting table", "error");
  }
};
