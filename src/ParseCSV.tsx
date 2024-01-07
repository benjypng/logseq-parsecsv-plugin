import Papa from "papaparse";
import { useState } from "react";
import ProgressBar from "./ProgressBar";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin";

const uniqueIdentifier = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "");

const ParseCSV = () => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [keyValue, setKeyValue] = useState(Date.now());

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSelectedFile(e.target.files[0]);
    setIsFilePicked(true);
  };

  const parse = async (e: any) => {
    if (!isFilePicked) {
      logseq.UI.showMsg("Please select a file first.", "error");
      return;
    } else {
      Papa.parse(selectedFile!, {
        complete: async (results) => {
          const response = results.data as string[][];
          if (!response || response.length == 0) return;

          if (e.target.name === "rendered") {
            await logseq.Editor.insertAtEditingCursor(
              `{{renderer :tables_${uniqueIdentifier()}}}`,
            );

            const tableBlock = await logseq.Editor.getCurrentBlock();

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

            const tableOptionsBlock = await logseq.Editor.getBlock(
              tableOptions.uuid,
              {
                includeChildren: true,
              },
            );
            if (!tableOptionsBlock) return;

            const interval = 100 / tableOptionsBlock.children!.length;
            for (let i = 0; i < tableOptionsBlock.children!.length; i++) {
              setProgressPercentage(
                (progressPercentage) => progressPercentage + interval,
              );
              for (let j = 1; j < response.length; j++) {
                await logseq.Editor.insertBlock(
                  (tableOptionsBlock.children![i] as BlockEntity).uuid,
                  response[j]![i] as string,
                  { before: false, sibling: false },
                );
              }
            }
          } else if (e.target.name === "markdown") {
            let markdownTable = "";
            for (const r of response) {
              const tmpVar = `|${r.join("|")}|`;
              markdownTable = `${markdownTable}
${tmpVar}`;
            }
            await logseq.Editor.insertAtEditingCursor(markdownTable);
          } else if (e.target.name === "inline") {
            const blk = await logseq.Editor.getCurrentBlock();

            let pBlk;
            for (let i = 1; i < response.length; i++) {
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
          }
          setKeyValue(Date.now());
          setIsFilePicked(false);
          logseq.hideMainUI();
          await logseq.Editor.restoreEditingCursor();
        },
      });
    }
  };

  return (
    <div className="flex justify-center border" tabIndex={-1}>
      <div className="absolute top-10 bg-white rounded-lg p-3 w-1/2 border flex flex-col">
        <input
          key={keyValue}
          className="mt-5 mb-3 block w-full cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-transparent text-sm rounded-lg"
          type="file"
          onChange={handleFile}
        />
        <div className="flex gap-3 mb-5 justify-between">
          <button
            name="rendered"
            type="button"
            className="text-sm py-2 px-4 bg-teal-600 hover:bg-blue-700 focus:ring-pink-500 focus:ring-offset-pink-200 text-white w-full transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            onClick={parse}
          >
            To Rendered Table
          </button>
          <button
            name="markdown"
            type="button"
            className="text-sm py-2 px-4 bg-purple-800 hover:bg-blue-700 focus:ring-pink-500 focus:ring-offset-pink-200 text-white w-full transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            onClick={parse}
          >
            To Markdown Table
          </button>
          <button
            name="inline"
            type="button"
            className="text-sm py-2 px-4 bg-green-800 hover:bg-blue-700 focus:ring-pink-500 focus:ring-offset-pink-200 text-white w-full transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            onClick={parse}
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
