// controllers/resourceController.js
const { v4: uuidv4 } = require('uuid');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');
const path = require('path');

const ajv = new Ajv();
addFormats(ajv);

// Load the schema from the file
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, '../schemas/resourceSchema.json'), 'utf8'));
const validate = ajv.compile(schema);

// In-memory key-value store
const store = {};

const createResource = (req, res) => {
  const data = req.body;

  // Validate the data against the schema
  if (!validate(data)) {
    return res.status(400).json({ errors: validate.errors });
  }

  // Check if a resource with the same objectId already exists
  if (store[data.objectId]) {
    return res.status(409).json({ error: 'Resource with this objectId already exists' });
  }

  // Create a new resource
  const id = data.objectId;
  store[id] = { data, etag: uuidv4() };
  res.status(201).json(store[id]);
};

const getResource = (req, res) => {
  const { id } = req.params;
  const ifNoneMatch = req.get('If-None-Match');

  if (!store[id]) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  const resource = store[id];
  if (ifNoneMatch && ifNoneMatch === resource.etag) {
    return res.status(304).end();
  }

  res.set('ETag', resource.etag);
  res.status(200).json(resource.data);
};

const deleteResource = (req, res) => {
  const { id } = req.params;

  if (!store[id]) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  delete store[id];
  res.status(204).end();
};

const getAllResources = (req, res) => {
  const resources = Object.values(store).map(item => item.data);
  res.status(200).json(resources);
};


module.exports = {
  createResource,
  getResource,
  deleteResource,
  getAllResources
};
