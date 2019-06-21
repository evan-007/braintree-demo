import { render } from 'react-dom';
import React from 'react';

import { Braintree, HostedField } from 'react-braintree-fields';


class BraintreeHostedfieldDemo extends React.PureComponent {

  constructor(props) {
    super(props);
    this.numberField = React.createRef();
    this.braintree = React.createRef();
    [
      'onError',
      'getToken',
      'onCardTypeChange',
      'onAuthorizationSuccess',
    ].forEach(prop => (this[prop] = this[prop].bind(this)));
  }

  state = {}

  onError(error) {
    this.setState({ error });
  }

  getToken() {
    this.tokenize().then(
      token => this.setState({ token, error: null }),
    ).catch(
      error => this.setState({ token: null, error }),
    );
  }

  onCardTypeChange({ cards }) {
    if (1 === cards.length) {
      const [card] = cards;

      this.setState({ card: card.type });

      if (card.code && card.code.name) {
        this.cvvField.setPlaceholder(card.code.name);
      } else {
        this.cvvField.setPlaceholder('CVV');
      }

    } else {
      this.setState({ card: '' });
      this.cvvField.setPlaceholder('CVV');
    }
  }

  state = {
    numberFocused: false,
  }

  componentDidMount() {
    this.setState({ authorization: 'sandbox_g42y39zw_348pk9cgf3bgyw2b' });
  }

  renderResult(title, obj) {
    if (!obj) { return null; }
    return (
      <div>
        <b>{title}:</b>
        <pre>{JSON.stringify(obj, null, 4)}</pre>
      </div>
    );
  }

  onAuthorizationSuccess() {
    this.numberField.current.focus();
  }

  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', margin: '50px' }}>
        <div>
          <h1>Braintree Hosted Fields Demo</h1>
          {this.renderResult('Error', this.state.error)}
          {this.renderResult('Token', this.state.token)}

          <Braintree
            ref={this.braintree}
            authorization={this.state.authorization}
            onAuthorizationSuccess={this.onAuthorizationSuccess}
            onError={this.onError}
            getTokenRef={t => (this.tokenize = t)}
            onCardTypeChange={this.onCardTypeChange}
          >
            <div>
              Number:
              <HostedField
                type="number"
                onBlur={() => this.setState({ numberFocused: false })}
                onFocus={() => this.setState({ numberFocused: true })}
                className={this.state.numberFocused ? 'focused' : ''}
                prefill="4111 1111 1111 1111"
                ref={this.numberField}
              />
              <p>Card type: {this.state.card}</p>
              Date:
              <HostedField type="expirationDate" />
              Month:
              <HostedField type="expirationMonth" />
              Full name:
              <input placeholder="tab focus will skip this input" type="text" />
              <br/>
              Year:
              <HostedField type="expirationYear" />
              CVV:
              <HostedField type="cvv" placeholder="CVV" ref={cvvField => { this.cvvField = cvvField; }} />
              Zip:
              <HostedField type="postalCode" />
              Full name:
              <input placeholder="tab focus will get you into this field" type="text" />
            </div>
          </Braintree>
          <div className="footer">
            <button onClick={this.getToken}>Get nonce token</button>
          </div>
        </div>
      </div>
    );
  }
}

export default BraintreeHostedfieldDemo;
