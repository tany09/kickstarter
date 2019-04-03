import React, {Component} from 'react';
import Campaign from '../../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import ContributeForm from '../../components/ContributeForm';
import web3 from '../../ethereum/web3';
import {Link} from '../../routes';

class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        return {
            address: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards() {
        const {
            minimumContribution,
            balance,
            requestsCount,
            approversCount,
            manager
        } = this.props;


        const items = [
            {
                header: manager,
                meta: 'Address of the manager',
                description: 'the manager can create a request and finalize it.',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minimumContribution,
                meta: 'Minimum contribution (wei)',
                description: 'You must contribute at least this much wei to become a contributor.',
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (in ether)',
                description: 'The amount of balance this contract holds.'
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'Number of approver who have already donated to this campaign'
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from the contract. Request must be approved by contributors.'
            }
        ]

        return <Card.Group items= {items} />

    }

    render () {
        return (<Layout>
            <h3>CampaignShow</h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        {this.renderCards()}
                    </Grid.Column>

                    <Grid.Column width={6}>
                        <ContributeForm address = {this.props.address}></ContributeForm>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Link route= {`/campaign/${this.props.address}/request`}>
                        <a>
                            <Button primary>View Requests</Button>
                        </a>
                    </Link> 
                </Grid.Row>
                

            </Grid>

            </Layout>
        );
    }
}

export default CampaignShow;