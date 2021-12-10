const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts, votingSystemContract;

beforeEach(async () => {
    // Get all the test accounts from ganache
    accounts = await web3.eth.getAccounts();

    // Use one of the account to deploy our contract
    console.log(interface, bytecode);
    votingSystemContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: accounts[0], gas: '1000000'})
})

describe('votingSystem', () => {

    it('deploys a contract', () => {
        console.log('Deploy contract log', votingSystemContract.options.address);
    });

    it('allows one candidate to enter', async () => {
        const enter1 = await votingSystemContract.methods.registerCandidate().send({
            from: accounts[1],
        })

        const enter2 = await votingSystemContract.methods.registerCandidate().send({
            from: accounts[2],
        })

        if(enter1 && enter2){
            const candidates =  await votingSystemContract.methods.getAllCandiates().call();
    
            console.log("Candidates are", candidates);
        }
    })

    it('register a vote', async () => {
        const register = await votingSystemContract.methods.registerVote(accounts[1]).send({
            from: accounts[0]
        })

        if(register){
            const candidates =  await votingSystemContract.methods.getAllCandiates().call();
            console.log("Candidates are after", candidates);
        }
    })

})

