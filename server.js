const express = require('express');
const path = require('path');
const fs = require('fs');
const api = require('./public/assets/js/index');

const PORT = process.env.PORT || 3001

const app = express();
