import React, {Component} from 'react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import Layout from '../../../components/Layout';
import {Form, Button, Message, Input} from 'semantic-ui-react';
import {Link, Router} from '../../../routes';

class RequestNew extends Component {
    state = {
        description: '',
        value: '',
        recipient: '',
        loading: false,
        errorMessage: ''
    }

    static getInitialProps (props) {
        const {address} = props.query;
        return {address};
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const campaign = Campaign(this.props.address);
        const {description, value, recipient} = this.state;
        this.setState({loading: true, errorMessage: ''});

        try {
            console.log(recipient);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient).send({
                from: accounts[0]
            });

            Router.pushRoute(`/campaign/${this.props.address}/request`);

        } catch (err) {
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false});
    }

    render () {
        return (
            <Layout>
                <Link route={`/campaign/${this.props.address}/request`} >
                    <a>
                        <Button primary>Back</Button>
                    </a>
                </Link>
                <h3>Create a Request</h3>

                <Form onSubmit= {this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                        value= {this.state.description}
                        onChange= {event => this.setState({description: event.target.value})}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Amount (in ether)</label>
                        <Input 
                        value= {this.state.value}
                        onChange= {event => this.setState({value: event.target.value})}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                        value={this.state.recipient}
                        onChange= {event => this.setState({recipient: event.target.value})}    
                        />
                    </Form.Field>
                    <Message error header='Oops!' content= {this.state.errorMessage} />
                    <Button primary loading= {this.state.loading}>Create</Button>
                </Form>
            </Layout>
        )
    }
}


export default RequestNew;