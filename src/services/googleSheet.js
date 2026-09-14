import React, { useEffect, useState } from 'react';
import axios from 'axios';

const parseCSV = (csvText) => {

    const rows = csvText.split(/\r?\n/);

    // Découpe une ligne uniquement sur les virgules
    // qui ne sont pas entre guillemets
    const splitCSVRow = (row) => {
        return row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    };

    const headers = splitCSVRow(rows[0]);
    const data = [];

    for (let i = 1; i < rows.length; i++) {
        // Ignore les lignes vides
        if (!rows[i].trim()) continue;

        const rowData = splitCSVRow(rows[i]);
        const rowObject = {};

        for (let j = 0; j < headers.length; j++) {
            // Retire les guillemets autour des valeurs
            rowObject[headers[j].trim()] = rowData[j]
                ? rowData[j].replace(/^"|"$/g, '')
                : '';
        }

        data.push(rowObject);
    }

    return data;
};

const fetchCSVData = async (sheetId) => {
  const csvUrl = `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?output=csv`; // Replace with your Google Sheets CSV file URL

  const request = axios.get(csvUrl);
  return await request.then(response => {
    const parsedCsvData = parseCSV(response.data);
    return parsedCsvData
  });
};

export default { fetchCSVData }