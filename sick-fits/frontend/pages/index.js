import React from 'react';
import Items from '../components/items';

const Home = ({ query }) => (
  <div>
    <Items page={parseInt(query.page) || 1} />
  </div>
);

export default Home;
