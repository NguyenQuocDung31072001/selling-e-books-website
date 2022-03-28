const express = require('express')
const router = express.Router()
const CollectionController = require('../controller/collection.controller')

router.post('/', CollectionController.createNewCollection)

router
  .route('/:id')
  .get(CollectionController.getCollectionById)
  .put(CollectionController.updateCollectionName)
  .delete(CollectionController.deleteCollection)

router.get('/account/:id', CollectionController.getCollectionOfAccount)

module.exports = router
