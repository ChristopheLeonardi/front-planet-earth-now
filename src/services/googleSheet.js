import React, { useEffect, useState } from 'react';
import axios from 'axios';

const parseCSV = (csvText) => {
  const rows = csvText.split(/\r?\n/); // Split CSV text into rows, handling '\r' characters
  const headers = rows[0].split(','); // Extract headers (assumes the first row is the header row)
  const data = []; // Initialize an array to store parsed data
  for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(','); // Split the row, handling '\r' characters
      const rowObject = {};
      for (let j = 0; j < headers.length; j++) {
          rowObject[headers[j]] = rowData[j];
      }
      data.push(rowObject);
  }
  return data;
}

const fetchCSVData = async (sheetId) => {
  const csvUrl = `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?output=csv`; // Replace with your Google Sheets CSV file URL

  const request = axios.get(csvUrl);
  return await request.then(response => {
    const parsedCsvData = parseCSV(response.data);
    return parsedCsvData
  });
};

export default { fetchCSVData }