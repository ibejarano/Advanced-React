import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {
  update = (cache, payload) => {
    // manually update the cache on the client so it matches with server
    // 1. read cache for the items
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    console.log(data);
    // 2. filter the delete item out of the page
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);
    // 3 . put the items back
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  render() {
    return (
      <Mutation mutation={DELETE_ITEM_MUTATION} variables={{ id: this.props.id }} update={this.update}>
        {(deleteItem, { error, loading }) => (
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure that you want to delete it?')) {
                deleteItem().catch(err => {
                  alert(err.message);
                });
              }
            }}
          >
            {this.props.children}
          </button>
        )}
      </Mutation>
    );
  }
}

export default DeleteItem;
