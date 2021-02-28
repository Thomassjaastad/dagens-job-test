const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const products = require('./db');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

http.createServer(app).listen(3001, () => {
  console.log('Listen on 0.0.0.0:3001');
});

app.post('/createproduct', (req, res) => {
  const newProduct = {
    id: req.body.id,
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
  };
  products.push(newProduct);
  res.send(newProduct);
});

app.get('/products', (req, res) => {
  let result;

  if (req.query.length === undefined) {
    result = products;
  }

  const page = req.query.page;
  const pageSize = 24;
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  let minPrice = req.query.minPrice;
  let maxPrice = req.query.maxPrice;
  let filterCategory = req.query.category;

  if (!maxPrice) {
    maxPrice = Infinity;
  }
  if (!minPrice) {
    minPrice = 0;
  }
  if (!filterCategory) {
    result = products.filter(
      ({ price }) => price >= minPrice && price <= maxPrice
    );
  }
  if (filterCategory !== undefined) {
    result = products.filter(
      ({ category, price }) =>
        category === filterCategory && price >= minPrice && price <= maxPrice
    );
  }
  const pageify = result.slice(startIndex, endIndex);
  res.json(pageify);
});

app.get('/nearestPrices/:id', (req, res) => {
  const id = req.params.id;
  const N = req.query.N;
  let product = products.filter((product) => product.id === id);
  product = product[0];
  const filterProducts = products.filter(
    ({ category }) => category === product.category
  );

  const sortedProducts = filterProducts.sort(function (a, b) {
    return a.price - b.price;
  });

  const absVal = sortedProducts.map((item, i) => {
    let diff = Math.abs(product.price - item.price);
    return { index: i, value: diff };
  });
  absVal.sort(function (a, b) {
    return a.value - b.value;
  });

  const sortedPriceProducts = absVal.map((item) => {
    return sortedProducts[item.index];
  });
  const nPlussOne = parseInt(N) + 1;
  const nearestN = sortedPriceProducts.slice(0, parseInt(N) + 1);
  res.json(nearestN);
});

process.on('SIGINT', function () {
  process.exit();
});
