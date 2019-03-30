const assert =  require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let campaignAddress;
let campaign;
let campaignFactory;


beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    campaignFactory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data : compiledFactory.bytecode})
    .send({from : accounts[0], gas: 1000000});

    await campaignFactory.methods.createCampaign('1').send({from: accounts[0], gas :'1000000'});

    const addresses = await campaignFactory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];

    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('campaign', () => {
    it('deploys a factory and campaign contract', () => {
        assert.ok(campaignFactory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute money and marks them as contributors', async () => {
        await campaign.methods.contribute().send({from : accounts[1], gas : '1000000', value : web3.utils.toWei('1', 'ether')});
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({from: accounts[1], value: web3.utils.toWei('0', 'ether'), gas: '1000000'});
            assert(false);
        } catch(err) {
            const isContributor = await campaign.methods.approvers(accounts[1]).call();
            assert(!isContributor);
        }
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods.createRequest('for dev', 0, accounts[1]).send({from: accounts[0], gas : '1000000'});
        const request = await campaign.methods.requests(0).call();
        assert.equal("for dev", request.description);
    });

    it('processes request', async () => {
        await campaign.methods.contribute().send({from: accounts[1], value: web3.utils.toWei('10', 'ether'), gas: '1000000'});
        await campaign.methods.createRequest("for dev", web3.utils.toWei('5', 'ether'), accounts[1]).send({from: accounts[0], gas : '1000000'});
        await campaign.methods.approveRequest(0).send({from: accounts[1], gas : '1000000'});
        await campaign.methods.finalizeRequest(0).send({from: accounts[0], gas : '1000000'});

        const request = await campaign.methods.requests(0).call();
        console.log(accounts[1]);

        assert(request.complete);
    })
})