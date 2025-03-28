"use client";

import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import GlobalHeader from "@/components/Header";
import CustomDataTable from "@/components/shared/datatable/CustomDataTable";
import TextInputField from "@/components/shared/textinput/TextInputField";
import GlobalDropdown from "@/components/shared/dropdown/GlobalDropdown";
import { Stack, Button } from "@carbon/react";
import styles from "./dropdownpage.module.scss";

const headers = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  { key: "status", header: "Status" },
];

interface TableRowData {
  id: string;
  name: string;
  status: string;
}

const tableData: Record<string, TableRowData[]> = {
  "Table 1": [
    { id: "1", name: "Item A", status: "Active" },
    { id: "2", name: "Item B", status: "Inactive" },
  ],
  "Table 2": [
    { id: "3", name: "Item C", status: "Pending" },
    { id: "4", name: "Item D", status: "Active" },
  ],
  "Table 3": [
    { id: "5", name: "Item E", status: "Inactive" },
    { id: "6", name: "Item F", status: "Pending" },
  ],
};

const NewPage = () => {
  const { t } = useTranslation();
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [rows, setRows] = useState<TableRowData[]>([]);
  const [textInput, setTextInput] = useState<string>("");

  // Handle file selection
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }
  };

  // Handle table selection from dropdown
  const handleTableChange = (selectedItem: string | null) => {
    if (!selectedItem) {
      setSelectedTable(null);
      setRows([]);
      return;
    }

    setSelectedTable(selectedItem);
    setRows(tableData[selectedItem]);
  };

  // Function to add new row dynamically
  const handleAddRow = () => {
    const newRow: TableRowData = {
      id: (rows.length + 1).toString(),
      name: `Item ${String.fromCharCode(65 + rows.length)}`,
      status: "Active",
    };
    setRows([...rows, newRow]);
  };

  return (
    <>
      <GlobalHeader />
      <main className={styles["new-page-container"]}>
        <h2 style={{ marginBottom: "2rem" }}>{t("newpage.title")}</h2>
        <Stack gap={5}>
          {/* File Input Field with Browse Button */}
          <div className={styles["file-input-container"]}>
            <TextInputField
              id="fileInput"
              name="fileInput"
              labelText={t("newpage.selectFile")}
              placeholder={t("newpage.noFileChosen")}
              value={fileName}
              onChange={() => {}}
              onBlur={() => {}}
            />
            <input
              type="file"
              ref={fileInputRef}
              className={styles["hidden-file-input"]}
              onChange={handleFileChange}
            />
            <Button
              kind="primary"
              size="sm"
              onClick={handleBrowseClick}
              className={styles["browse-button"]}
            >
              {t("newpage.browse")}
            </Button>
          </div>

          <TextInputField
            id="textInput"
            name="textInput"
            labelText={t("newpage.enterText")}
            placeholder={t("newpage.placeholder")}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onBlur={() => {}}
          />

          {/* Dropdown to Select Table */}
          <GlobalDropdown
            id="tableDropdown"
            label={t("newpage.chooseTable")} // This is the main label
            items={Object.keys(tableData)}
            selectedItem={selectedTable || ""}
            onChange={handleTableChange}
          />

          {/* Show Table Based on Selection */}
          {selectedTable && (
            <div className={styles["table-container"]}>
              <CustomDataTable
                headers={headers}
                rows={rows}
                onAddRow={handleAddRow}
                onDeleteRows={(selectedRows) =>
                  setRows(
                    rows.filter(
                      (row) => !selectedRows.some((sel) => sel.id === row.id)
                    )
                  )
                }
              />
            </div>
          )}
        </Stack>
      </main>
    </>
  );
};

export default NewPage;
