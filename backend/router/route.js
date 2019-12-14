const express = require('express');

const chain = require('../chain/chain');

const route = express.Router();
const repository = require('../repository/repo');

// add org
route.post('/org', (req, res) => {
    const { name, isCompany, certified } = req.body;
    // store to chain
    (isCompany ? chain.addCompany(certified) : chain.addFinancialInst(certified))
        .then(id => {
            // store to db
            repository.create(name, id, isCompany)
                .then(_ => {
                    res.status(201).json({
                        name: name,
                        id: id,
                        isCompany: isCompany
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => { console.log(err) });
});

// get org
route.get('/org', (req, res) => {
    const { name } = req.query;
    let org = {};
    repository.findIDByName(name)
        .then(id => {
            chain.getReputation(id)
                .then(reputation => {
                    org.reputation = reputation;
                    chain.getMoneyToPay(id)
                        .then(moneyToPay => {
                            org.moneyToPay = moneyToPay;
                            chain.getMoneyToReceive(id)
                                .then(moneyToReceive => {
                                    org.moneyToReceive = moneyToReceive;
                                    res.status(200).json({
                                        reputation: org.reputation,
                                        moneyToPay: org.moneyToPay,
                                        moneyToReceive: org.moneyToReceive
                                    });
                                })
                                .catch(err => { console.log(err) });
                        })
                        .catch(err => { console.log(err) });
                })
                .catch(err => { console.log(err) });
        })
        .catch(() => {
            res.status(404).json(null);
        });
});

// get orgs
route.get('/orgs', (req, res) => {
    repository.findAll()
        .then(orgs => orgs.map(org => org.name))
        .then(names => {
            res.status(200).json({
                names: names
            });
        })
        .catch(err => { console.log(err) });
});

// add payment
route.post('/payment', (req, res) => {
    const { fromName, toName, amount, payBackEndTime, description } = req.body.params;
    repository.findIDByName(fromName)
        .then(fromID => {
            repository.findIDByName(toName)
                .then(toID => {
                    chain.addPayment(fromID, toID, amount, payBackEndTime, description)
                        .then(() => {
                            res.status(204).json(null);
                        })
                        .catch(err => { console.log(err) });
                })
                .catch(err => { console.log(err) });
        })
        .catch(err => { console.log(err) });
});

// transfer payment
route.put('/payment', (req, res) => {
    const { fromName, toName, amount, description } = req.body.params;
    repository.findIDByName(fromName)
        .then(fromID => {
            repository.findIDByName(toName)
                .then(toID => {
                    chain.transferPayment(fromID, toID, amount, description)
                        .then(() => {
                            res.status(204).json(null);
                        })
                        .catch(err => { console.log(err) });
                })
                .catch(err => { console.log(err) });
        })
        .catch(err => { console.log(err) });
});

// fund
route.post('/fund', (req, res) => {
    const { fromName, toName, amount, description } = req.body.params;
    repository.findIDByName(fromName)
        .then(fromID => {
            repository.findIDByName(toName)
                .then(toID => {
                    chain.fund(fromID, toID, amount, description)
                        .then(() => {
                            res.status(204).json(null);
                        })
                        .catch(err => { console.log(err) });
                })
                .catch(err => { console.log(err) });
        })
        .catch(err => { console.log(err) });
});

// get reputation
route.delete('/payment', (req, res) => {
    const { name, amount, currentTime } = req.query;
    repository.findIDByName(name)
        .then(id => {
            chain.payBack(id, amount, currentTime)
                .then(reputation => {
                    res.status(204).json({
                        reputation: reputation
                    });
                })
                .catch(err => { console.log(err) });
        })
        .catch(err => { console.log(err) });
});

module.exports = route;