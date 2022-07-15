const express = require('express');
const app = express();
const port = 4501;

const fs = require('fs');

const rawContributorData = fs.readFileSync('data/contributors.json');

import {
  ProcessedContributorData,
  RawContributorData,
} from '../types/contributors';
import { PagedResults } from './../types/paging';

app.get('/', (req: any, res: any) => {
  const query = req.query;
  res.send(`
    Hello World!
    Query was ${JSON.stringify(query)}
  `);
});

app.get('/contributors', (req: any, res: any) => {
  //getting the complete processed data
  const processedContributorData = processData(rawContributorData);

  // get the query data from url
  const page = parseInt(req.query.page);
  const page_size = parseInt(req.query.page_size);

  // getting the indices to slice the total result array
  const startIndex = (page - 1) * page_size;
  const endIndex = page * page_size;

  // getting the paginated data depending on query of page number and page size
  const paginatedData = processedContributorData.slice(startIndex, endIndex);

  // inserting the data to pagedResults format
  const pagedResults: PagedResults<ProcessedContributorData> = {
    items:
      Object.keys(req.query).length === 0
        ? processedContributorData
        : paginatedData,
    total: processedContributorData.length,
  };
  res.send(pagedResults);
});

const processData = (data) => {
  //parsing the raw data and processing it
  const rawData: RawContributorData[] = JSON.parse(data);
  const processedData: ProcessedContributorData[] = [];
  rawData.forEach((item) => {
    const data: ProcessedContributorData = {
      author: item.author,
      clans_contributed_to: item.clans_contributed_to.split(','), //data is in string type, therefore splitting it to get string array type
      contribution_range: {
        start: new Date(item.first_contribution), //converting the date from string format to date format
        end: new Date(item.last_contribution), //converting the date from string format to date format
      },
      total_contributions: item.total_contributions,
    };

    processedData.push(data);
  });

  return processedData;
};

app.listen(port);

console.log(`App listening on http://localhost:${port}`);
