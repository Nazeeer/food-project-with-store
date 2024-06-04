import React, { useContext, useState } from 'react'
import classes from './Cart.module.css'
import Modal from '../UI/Modal'
import CartContext from '../../store/Cart-context'
import CartItem from './CartItem'
import Checkout from './Checkout'
const Cart = (props) => {
    const [isCheckout, setIsCheckout] =useState(false)
    const [ isSubmitting,setIsSubmitting] = useState(false)
    const [ didSubmit,setDidSubmit] = useState(false)
    const cartCtx = useContext(CartContext)

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`
    const hasItems = cartCtx.items.length > 0

    const cartItemRemoveHandler = (id)=>{
        cartCtx.removeItem(id)
    }
    const cartAddItemHandler = (item)=>{
        cartCtx.addItem({...item,amount:1})
    }

    const ordereHandler = ()=>{
        setIsCheckout(true)
    }

    const submitOrderHandler = async (userData)=>{
        setIsSubmitting(true);
        await fetch('https://react-http-92d63-default-rtdb.firebaseio.com/orders.json',{
            method:'POST',
            body: JSON.stringify({
                user: userData,
                orderedItems: cartCtx.items
            })
        })
        setIsSubmitting(false);
        setDidSubmit(true);
        cartCtx.clearCart();
    }


    const cartItems=(<ul className={classes['cart-items']}>{cartCtx.items.map((item , i)=>(
        <CartItem key={i} 
        name={item.name} 
        amount={item.amount} 
        price={item.price} 
        onRemove={cartItemRemoveHandler.bind(null , item.id)}
        onAdd={cartAddItemHandler.bind(null , item)}
        />
    ))}</ul>)

const modalAction = (
    <div className={classes.actions}>
    <button onClick={props.hideCartHandler} className={classes['button--alt']}>
        Close
        </button>
    {   hasItems && 
    (<button className={classes.button} onClick={ordereHandler}>
        Order
    </button>)}
    </div>)


const cartModalContent = <>
{cartItems}
        <div className={classes.total}>
            <span>Total Amount</span>
            <span>{totalAmount}</span>
        </div>
        {isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.hideCartHandler}/> }
        {!isCheckout && modalAction}
        
</>

const isSubmittingModalContent = <p>Sending order data...</p>;
const didSubmitModalContent =( <>
    <p>Successfully sent the order!</p>
    <div className={classes.actions}>
    <button onClick={props.hideCartHandler} className={classes.button}>
        Close
        </button>
    </div>
</>);
  return (
    <Modal hideCartHandler={props.hideCartHandler}>
        {!isSubmitting && !didSubmit && cartModalContent}
        {isSubmitting && isSubmittingModalContent}
        {!isSubmitting && didSubmit &&  didSubmitModalContent}
    </Modal>
  )
}

export default Cart