import { BlockEntity } from "@logseq/libs/dist/LSPlugin";
import { papaParse } from "./papa-parse";
import { handleProgressBar } from "./handle-progress-bar";

export const insertRendered = async (
  thingToParse: File | string | undefined,
  setProgressPercentage: React.Dispatch<React.SetStateAction<number>>,
  setThingToParse: React.Dispatch<
    React.SetStateAction<File | string | undefined>
  >,
) => {
  try {
    const response = await papaParse(thingToParse);
    if (!response) return;

    const tableBlock = await logseq.Editor.getCurrentBlock();
    if (!tableBlock) return;

    await logseq.Editor.insertAtEditingCursor(
      `{{renderer :tables_${tableBlock.uuid}}}`,
    );

    const tableOptions = await logseq.Editor.insertBlock(
      tableBlock!.uuid,
      "data nosum nostyle",
      { before: false, sibling: false },
    );
    if (!tableOptions) return;

    for (const r of response[0]!) {
      await logseq.Editor.insertBlock(tableOptions.uuid, r, {
        before: false,
        sibling: false,
      });
    }

    const tableOptionsBlock = await logseq.Editor.getBlock(tableOptions.uuid, {
      includeChildren: true,
    });
    if (!tableOptionsBlock) return;

    for (let i = 0; i < tableOptionsBlock.children!.length; i++) {
      handleProgressBar(tableOptionsBlock.children!, setProgressPercentage);
      for (let j = 1; j < response.length; j++) {
        await logseq.Editor.insertBlock(
          (tableOptionsBlock.children![i] as BlockEntity).uuid,
          response[j]![i] as string,
          { before: false, sibling: false },
        );
      }
    }

    logseq.hideMainUI();
    setThingToParse(undefined);
  } catch (error) {
    console.error(error);
    await logseq.UI.showMsg("Error parsing and inserting table", "error");
  }
};
