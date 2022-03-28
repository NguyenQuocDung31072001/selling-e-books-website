const slugify = require('slugify')

const generateSlug = async (Model, name) => {
  let slug = slugify(name, { lower: true, locale: 'vi' })
  let savedObj = await Model.findOne({ slug: slug })
  if (savedObj) {
    console.log(slug)
    const objSlugs = await Model.find({ slug: new RegExp(`^${slug}-\\d$`) })
    if (objSlugs.length > 0) {
      let index = 1
      objSlugs.forEach(item => {
        let slugArr = item.slug.split('-')
        index = Math.max(index, parseInt(slugArr.pop()))
      })
      index++
      slug += '-' + index
    } else {
      slug += '-1'
    }
  }
  return slug
}

module.exports = generateSlug