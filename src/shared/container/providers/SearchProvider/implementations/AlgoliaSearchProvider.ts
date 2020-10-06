import algoliasearch from 'algoliasearch';

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID ? process.env.ALGOLIA_APP_ID : '',
  process.env.ALGOLIA_APP_KEY ? process.env.ALGOLIA_APP_KEY : '',
);

const index = client.initIndex('Exams');
