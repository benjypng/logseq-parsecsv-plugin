import { handleProgressBar } from "./handle-progress-bar";
import { papaParse } from "./papa-parse";

export const insertInline = async (
  thingToParse: File | string | undefined,
  setProgressPercentage: React.Dispatch<React.SetStateAction<number>>,
  setThingToParse: React.Dispatch<
    React.SetStateAction<File | string | undefined>
  >,
) => {
  try {
    const response = await papaParse(thingToParse);
    if (!response) return;

    const blk = await logseq.Editor.getCurrentBlock();

    let pBlk;
    for (let i = 1; i < response.length; i++) {
      handleProgressBar(response, setProgressPercentage);
      for (let j = 0; j < response[i]!.length; j++) {
        if (j === 0) {
          pBlk = await logseq.Editor.insertBlock(
            blk!.uuid,
            response[i]![j] as string,
            { before: true, sibling: true },
          );
        } else {
          if (logseq.settings!.omitBlanks && response[i]![j] !== "") {
            continue;
          } else {
            await logseq.Editor.insertBlock(
              pBlk!.uuid,
              response[i]![j] as string,
              {
                before: false,
                sibling: false,
              },
            );
          }
        }
      }
    }
    await logseq.Editor.removeBlock(blk!.uuid);
    logseq.hideMainUI();
    setThingToParse(undefined);
  } catch (error) {
    console.error(error);
    await logseq.UI.showMsg("Error parsing and inserting table", "error");
  }
};
