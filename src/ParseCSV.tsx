import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import ProgressBar from './ProgressBar';

const uniqueIdentifier = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '');

const ParseCSV = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const handleFile = (e: any) => {
    setSelectedFile(e.target.files[0]);
    setIsFilePicked(true);
  };

  const parse = async () => {
    Papa.parse(selectedFile, {
      complete: async (results) => {
        const response: any[] = results.data;

        await logseq.Editor.insertAtEditingCursor(
          `{{renderer :tables_${uniqueIdentifier()}}}`
        );

        const tableBlock = await logseq.Editor.getCurrentBlock();

        const tableOptions = await logseq.Editor.insertBlock(
          tableBlock.uuid,
          'data nosum nostyle',
          { before: false, sibling: false }
        );

        for (let r of response[0]) {
          await logseq.Editor.insertBlock(tableOptions.uuid, r, {
            before: false,
            sibling: false,
          });
        }

        const tableOptionsBlock: BlockEntity = await logseq.Editor.getBlock(
          tableOptions.uuid,
          { includeChildren: true }
        );

        const interval: number = 100 / tableOptionsBlock.children.length;
        for (let i = 0; i < tableOptionsBlock.children.length; i++) {
          setProgressPercentage(
            (progressPercentage) => progressPercentage + interval
          );
          for (let j = 1; j < response.length; j++) {
            await logseq.Editor.insertBlock(
              tableOptionsBlock.children[i]['uuid'],
              response[j][i],
              { before: false, sibling: false }
            );
          }
        }
        logseq.hideMainUI();
      },
    });
  };

  return (
    <div className="flex justify-center" tabIndex={-1}>
      <div className="absolute top-10 bg-white rounded-lg p-3 w-1/3 border">
        <input
          className="mb-3 block w-full cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-transparent text-sm rounded-lg"
          type="file"
          onChange={handleFile}
        />
        <button
          type="button"
          className="mb-5 py-2 px-4  bg-teal-600 hover:bg-blue-700 focus:ring-pink-500 focus:ring-offset-pink-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full"
          onClick={parse}
        >
          Parse CSV
        </button>
        <ProgressBar progressPercentage={progressPercentage} />
      </div>
    </div>
  );
};

export default ParseCSV;
