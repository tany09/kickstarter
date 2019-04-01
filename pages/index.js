import {Card, Button} from 'semantic-ui-react';
import React, {Component} from 'react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import {Link} from '../routes';


class ComponentIndex extends Component {

    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return {campaigns};
    }

    renderCampaigns () {
        const items = this.props.campaigns.map((address) => {
            return {
                header: address,
                description: (
                    <Link route={`/campaign/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            }
        })

        return <Card.Group items= {items} />
    }

    render () {
        return (
        <Layout>
        <div>
        <Link route= '/campaign/new'>
        <a>
        <Button 
        icon= 'add circle'
        content= 'Create Campaign'
        floated="right"
        primary 
        />
        </a>
        </Link>
        {this.renderCampaigns()}
        </div>
        </Layout>
        )
    }
}

export default ComponentIndex;