import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import formatMoney from '../lib/formatMoney';
import RemoveFromCart from './RemoveFromCart';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`;

const CartItem = ({ cartItem }) => (
  <CartItemStyles>
    <img width="100" src={cartItem.item.image} alt={cartItem.item.title} />
    <div>
      <h2>{cartItem.item.title}</h2>
      <p>
        {formatMoney(cartItem.item.price * cartItem.quantity)}
        {' - '}
        <em>
          {cartItem.quantity} &times; {formatMoney(cartItem.item.price)} Each
        </em>
      </p>
    </div>
    <RemoveFromCart id={cartItem.id} />
  </CartItemStyles>
);

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired,
};

export default CartItem;
