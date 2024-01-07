import "@logseq/libs";
import React from "react";
import ReactDOM from "react-dom";
import { handleClosePopup } from "./handleClosePopup";
import ParseCSV from "./ParseCSV";
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

const settings: SettingSchemaDesc[] = [
  {
    key: "",
    default: "",
    type: "heading",
    title: "Inline",
    description: "",
  },
  {
    key: "omitBlanks",
    type: "boolean",
    default: false,
    title: "Omit Blank Fields",
    description:
      "If set to true, blank fields will be skipped when inserting blocks.",
  },
];

const main = async () => {
  console.log("logseq-parsecsv-plugin loaded");

  logseq.Editor.registerSlashCommand("Parse CSV", async () => {
    ReactDOM.render(
      <React.StrictMode>
        <ParseCSV />
      </React.StrictMode>,
      document.getElementById("app"),
    );

    logseq.showMainUI();
  });

  handleClosePopup();
};

logseq.useSettingsSchema(settings).ready(main).catch(console.error);
