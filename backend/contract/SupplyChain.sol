pragma solidity ^0.4.23;

contract SupplyChain {
    // organization Type
    enum OrgType {
        // registered company
        Company,
        // financial institution
        FinancialInst
    }

    // information of transaction
    struct Transaction {
        // "from" org's id
        uint fromID;
        // "to" org's id
        uint toID;
        // whether the org has paid back this money
        bool paidBack;
        // amount of money
        uint amount;
        // the end time to pay back
        uint payBackEndTime;
        // description of the transaction
        string description;
    }

    // information of organization
    struct Organization {
        // the type of the organization
        OrgType orgType;
        // whether the organization is certified
        bool certified;
        // reputation score
        int reputation;
        // money to receive
        uint moneyToReceive;
        // transactions from other organizations (orgID => txIDs)
        mapping (uint => uint[]) txsFrom;
        // money to pay
        uint moneyToPay;
        // transactions to other organizations (orgID => txIDs)
        mapping (uint => uint[]) txsTo;
    }

    // the number of organizations
    uint numOrgs = 0;
    // organizations
    mapping (uint => Organization) orgs;

    // the number of transactions
    uint numTxs = 0;
    mapping (uint => Transaction) txs;

    // financial agency
    address agency;
    // modifier for agency
    modifier onlyAgency() {
        require(
            msg.sender == agency,
            "Only agency can call this function"
        );
        _;
    }

    constructor() public {
        agency = msg.sender;
    }

    // get reputation of the org
    function getReputation(
        uint orgID
    ) public view onlyAgency returns (int reputation) {
        reputation = orgs[orgID].reputation;
    }

    // get money to pay of the org
    function getMoneyToPay(
        uint orgID
    ) public view onlyAgency returns (uint moneyToPay) {
        moneyToPay = orgs[orgID].moneyToPay;
    }

    // get money to receive of the org
    function getMoneyToReceive(
        uint orgID
    ) public view onlyAgency returns (uint moneyToReceive) {
        moneyToReceive = orgs[orgID].moneyToReceive;
    }

    // add a new registered company
    function addCompany(
        bool certified
    ) public onlyAgency returns (uint id) {
        id = numOrgs;
        numOrgs += 1;
        orgs[id] = Organization({
            orgType: OrgType.Company,
            certified: certified,
            reputation: 10,
            moneyToReceive: 0,
            moneyToPay: 0
        });
    }

    // add a new registered financial institution
    function addFinancialInst(
        bool certified
    ) public onlyAgency returns (uint id) {
        id = numOrgs;
        numOrgs += 1;
        orgs[id] = Organization({
            orgType: OrgType.FinancialInst,
            certified: certified,
            reputation: 10,
            moneyToReceive: 0,
            moneyToPay: 0
        });
    }

    // add a new payment
    function addPayment(
        uint fromID,
        uint toID,
        uint amount,
        uint payBackEndTime,
        string memory description
    ) public onlyAgency returns (bool) {
        // add new transaction
        uint newTxID = numTxs;
        txs[newTxID] = Transaction({
            fromID: fromID,
            toID: toID,
            paidBack: false,
            amount: amount,
            payBackEndTime: payBackEndTime,
            description: description
        });
        numTxs += 1;

        Organization storage fromOrg = orgs[fromID];
        Organization storage toOrg = orgs[toID];

        // add fx: "from" org -> "to" org
        fromOrg.moneyToPay += amount;
        fromOrg.txsTo[toID].push(newTxID);
        toOrg.moneyToReceive += amount;
        toOrg.txsFrom[fromID].push(newTxID);

        return true;
    }

    // get organization by id (to keep the stack from too deep)
    function getOrg(
        uint orgID
    ) private view onlyAgency returns (Organization storage) {
        return orgs[orgID];
    }

    // transfer payment or money
    function transfer(
        uint fromID,
        uint toID,
        uint amount,
        string memory description
    ) private onlyAgency returns (bool) {
        Organization storage fromOrg = getOrg(fromID);
        // check amount
        require(
            amount <= fromOrg.moneyToReceive,
            "Not enough money to transfer"
        );

        Organization storage toOrg = orgs[toID];

        uint needToPay = amount;

        // iter "from" org's txsFrom
        for (uint orgID = 0; orgID < numOrgs && needToPay > 0; orgID++) {
            if (orgID == fromID) {
                continue;
            }

            // tx ids (from "pay" org to "from" org)
            uint[] storage txIDs = fromOrg.txsFrom[orgID];

            // check if "from" org will receive money from orgs[orgID]
            if (txIDs.length != 0) {
                // the real org to pay
                Organization storage payOrg = orgs[orgID];

                for (uint i = 0; i < txIDs.length && needToPay > 0; i++) {
                    // current tx
                    Transaction storage currTx = txs[txIDs[i]];
                    if (currTx.paidBack) {
                        continue;
                    }

                    // transfer money for current tx
                    uint transferMoney = 0;

                    // step 1:
                    // update tx: "pay" org -> "from" org
                    if (currTx.amount > needToPay) {
                        transferMoney = needToPay;
                    }
                    else {
                        transferMoney = currTx.amount;
                        currTx.paidBack = true;
                    }
                    currTx.amount -= transferMoney;
                    needToPay -= transferMoney;

                    fromOrg.moneyToReceive -= transferMoney;

                    // step 2:
                    // add tx: "pay" org -> "to" org
                    if (transferMoney > 0) {
                        uint newTxID = numTxs;
                        txs[newTxID] = Transaction({
                            fromID: orgID,
                            toID: toID,
                            paidBack: false,
                            amount: transferMoney,
                            payBackEndTime: currTx.payBackEndTime,
                            description: description
                        });
                        numTxs += 1;

                        payOrg.txsTo[toID].push(newTxID);

                        toOrg.moneyToReceive += transferMoney;
                        toOrg.txsFrom[orgID].push(newTxID);
                    }
                }
            }
        }

        return true;
    }

    // transfer payment
    function transferPayment(
        uint fromID,
        uint toID,
        uint amount,
        string memory description
    ) public onlyAgency returns (bool) {
        return transfer(
            fromID,
            toID,
            amount,
            description
        );
    }

    // funding from financial institution
    function fund(
        uint companyID,
        uint financialInstID,
        uint amount,
        string memory description
    ) public onlyAgency returns (bool) {
        require(
            orgs[financialInstID].orgType == OrgType.FinancialInst,
            "Should be funding from financial institution"
        );
        return transfer(
            companyID,
            financialInstID,
            amount,
            description
        );
    }

    // pay back
    function payBack(
        uint fromID,
        uint amount,
        uint currentTime
    ) public onlyAgency returns (bool) {
        Organization storage fromOrg = orgs[fromID];
        // check amount
        require(
            amount <= fromOrg.moneyToPay,
            "Too much money"
        );

        uint needToPay = amount;

        // iter all txs
        for (uint i = 0; i < numTxs && needToPay > 0; i++) {
            // current tx
            Transaction storage currTx = txs[i];
            if (currTx.fromID != fromID || currTx.paidBack) {
                continue;
            }

            // money to pay back for current tx
            uint paybackMoney = 0;

            if (currTx.amount > needToPay) {
                paybackMoney = needToPay;
            }
            else {
                paybackMoney = currTx.amount;
                currTx.paidBack = true;
            }
            currTx.amount -= paybackMoney;
            needToPay -= paybackMoney;

            // update "from" org
            fromOrg.moneyToPay -= paybackMoney;
            if (currentTime <= currTx.payBackEndTime) {
                fromOrg.reputation += 1;
            }
            else {
                fromOrg.reputation -= 1;
            }

            // update "to" org
            uint toID = currTx.toID;
            Organization storage toOrg = orgs[toID];
            toOrg.moneyToReceive -= paybackMoney;
        }

        return true;
    }
}