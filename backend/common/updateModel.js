const { default: mongoose } = require('mongoose')

const AddBook = async (model, modelIds, bookId) => {
  try {
    const updatedModel = await model.findOneAndUpdate(
      { _id: { $in: modelIds } },
      { $push: { books: bookId } },
      { new: true }
    )
    return updatedModel
  } catch (error) {
    console.log({ AuthorAddBookError: error })
  }
}

const AddBooks = async (model, modelIds, bookIds) => {
  try {
    const updatedModel = await model.findOneAndUpdate(
      { _id: { $in: modelIds } },
      { $push: { books: { $each: bookIds } } },
      { new: true }
    )
    return updatedModel
  } catch (error) {
    console.log({ AuhtorAddBookError: error })
  }
}

const DeleteBook = async (model, bookId) => {
  try {
    const updatedModel = await model.updateMany(
      { books: bookId },
      { $pull: { books: bookId } }
    )
    return updatedModel
  } catch (error) {
    console.log({ deleteBookError: error })
    throw new Error('Delete Fail')
  }
}

const DeleteBooks = async (model, bookIds) => {
  try {
    const updatedModel = await model.updateMany(
      { books: { $in: bookIds } },
      { $pull: { books: { $in: bookIds } } }
    )
    return updatedModel
  } catch (error) {
    console.log({ DeleteBooksError: error })
    throw new Error('Update fail')
  }
}

const RemoveBook = async (model, modelIds, bookId) => {
  try {
    const updatedModel = await model.findOneAndUpdate(
      { _id: { $in: modelIds } },
      { $pull: { books: bookId } },
      { new: true }
    )
    return updatedModel
  } catch (error) {
    console.log({ AuthorAddBookError: error })
  }
}

module.exports = {
  AddBook,
  AddBooks,
  DeleteBook,
  DeleteBooks,
  RemoveBook
}
