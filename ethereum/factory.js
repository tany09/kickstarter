import web3 from './web3';

import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), '0x92BeB62Db3D40464A3659c9292F74beC388736d2');

export default instance;