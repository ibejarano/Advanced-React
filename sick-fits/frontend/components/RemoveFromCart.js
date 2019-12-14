import React from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

class RemoveFromCart extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  // this is called when we get the response back from the server
  update = (cache, payload) => {
    // 1 read the cache
    console.log('Running remove from cart update fn')
    const data = cache.readQuery({query: CURRENT_USER_QUERY});
    console.log(data)
    // 2 remove the item from thee cart
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId)
    // 3 writi t back to the cache
    cache.writeQuery({query: CURRENT_USER_QUERY, data})
  };

  render() {
    return (
      <Mutation 
      mutation={REMOVE_FROM_CART_MUTATION} 
      variables={{ id: this.props.id }} 
      update={this.update} 
      optimisticResponse={{__typename: 'Mutation', removeFromCart: {
          __typename: 'cartItem',
          id: this.props.id,
      }}} >
        {(removeFromCart, { loading, error }) => (
          <BigButton
            onClick={() => {
              removeFromCart().catch(err => alert(err.message));
            }}
            title="Delete Item"
            disabled={loading}
          >
            &times;
          </BigButton>
        )}
      </Mutation>
    );
  }
}

export default RemoveFromCart;
