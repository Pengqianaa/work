import React from 'react'
import { Badge, IconButton } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useCart } from '../../../hooks/useCart'

const CartButton = () => {
  const { items, openCart } = useCart()

  return (
    <IconButton color="inherit" onClick={openCart}>
      <Badge badgeContent={items.length} color="secondary">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  )
}

export default CartButton 