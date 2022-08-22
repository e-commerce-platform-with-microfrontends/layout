import React, { useEffect, useState } from 'react';

import { Heading4 } from 'ui-components';
import * as S from './Header.styles';

export default () => {
  const [itemsInCart, setItemsInCart] = useState([]);

  const addToCartEventlistener = async ({ detail }) => {
    const newItemInCart = { item: { id: detail.itemId, price: detail.price } };

    try {
      const itemAdded = await fetch(`http://localhost:4000/cart/1/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItemInCart)
      }).then(res => res.json());

      setItemsInCart((itemsInCart) => [...itemsInCart, itemAdded]);
    } catch (e) {
      alert('something went wrong')
    }
  };

  const removeFromCartEventlistener = async ({ detail }) => {
    try {
      await fetch(`http://localhost:4000/items/${detail.itemId}`, {
        method: 'DELETE',
      }).then(res => res.json());

      setItemsInCart((itemsInCart) => itemsInCart.filter(item => item.id !== detail.itemId));
    } catch (e) {
      alert('something went wrong')
    }
  };

  useEffect(async () => {
    const itemsInCart = await fetch(`http://localhost:4000/cart/1/items`).then(res => res.json());

    setItemsInCart(itemsInCart);
  }, []);

  useEffect(() => {
    window.addEventListener('ADD_TO_CART', addToCartEventlistener)
    window.addEventListener('REMOVE_FROM_CART', removeFromCartEventlistener)
    return () => {
      window.removeEventListener('ADD_TO_CART', addToCartEventlistener)
      window.removeEventListener('REMOVE_FROM_CART', addToCartEventlistener)
    }
  }, []);

  return (
    <S.Header>
      <div className='container'>
        <S.Content>
          <a href="http://localhost:3000/products/">
            <Heading4>CBP Marketplace</Heading4>
          </a>
          <S.CartLink id="go-to-cart" href="http://localhost:3000/cart/">
            Cart
            {
              itemsInCart.length > 0 &&
              <S.CartCount id="cart-count">{itemsInCart.length}</S.CartCount>
            }
          </S.CartLink>
        </S.Content>
      </div>
    </S.Header>
  )
}