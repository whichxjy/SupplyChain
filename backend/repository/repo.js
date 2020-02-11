const Org = require('../model/org')

class OrgRepository {
  constructor (model) {
    this.model = model
  }

  // create a new org
  create (name, id, isCompany) {
    const newOrg = { name, id, isCompany }
    const org = new this.model(newOrg)
    return org.save()
  }

  // find all orgs
  findAll () {
    return this.model.find()
  }

  // find all FIs
  findAllFI () {
    return this.model.find({ isCompany: false })
  }

  // find org's id by name
  findIDByName (name) {
    return this.model.findOne({ name: name }).then(org => org.id)
  }
}

module.exports = new OrgRepository(Org)
