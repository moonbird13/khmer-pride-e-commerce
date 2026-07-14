import {
  findOrders,
  findOrderById,
  createOrderRecord,
  createOrderDetail,
  saveOrder
} from "../repository/order.repository.js";

import {findAddressById} from "../repository/address.repository.js";


//----------------------------------------------------
// Create Order
//----------------------------------------------------

export const createOrder = async ({
  userId,
  addressId,
  items,
  paymentMethod
}) => {

  // Get shipping address snapshot
  const address = await findAddressById(addressId);
  if (!address) {
    throw new Error("Address not found");
  }

  // Calculate total
  const total = items.reduce((sum, item) => {

    const subtotal = Number(item.price) * Number(item.quantity);
    return sum + subtotal;

  }, 0);


  // Create order record
  const order = await createOrderRecord({

    userId,
    total,
    address: {

      houseNumber: address.houseNumber,
      street: address.street,
      commune: address.commune,
      district: address.district,
      province: address.province

    }

  });



  // Create order details
  await Promise.all(

    items.map(item => {

      const subtotal =
        Number(item.price) *
        Number(item.quantity);

      return createOrderDetail({
        orderId: order.orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
        subTotal: subtotal
      });

    })

  );

  return formatOrder(order, items);

};



//----------------------------------------------------
// Get Orders
//----------------------------------------------------

export const listOrders = async(userId)=>{

  const orders = await findOrders(userId);

  return orders.map(order =>
    formatOrder(order)
  );

};


//----------------------------------------------------
// Get Order By ID
//----------------------------------------------------

export const getOrder = async(orderId)=>{

  const order = await findOrderById(orderId);

  if(!order){
    return null;
  }

  return formatOrder(order);

};



//----------------------------------------------------
// Cancel Order
//----------------------------------------------------

export const cancelOrder = async(orderId)=>{

  const order = await findOrderById(orderId);

  if(!order){
    return null;
  }

  // Business rule
  if(order.orderStatus === "Completed"){
    throw new Error(
      "Completed order cannot be cancelled"
    );
  }


  order.orderStatus = "Cancelled";
  await saveOrder(order);
  return formatOrder(order);

};



//----------------------------------------------------
// Update Status (Admin/Staff)
//----------------------------------------------------

export const updateOrderStatus = async(
  orderId,
  status
)=>{

  const order = await findOrderById(orderId);

  if(!order){
    return null;
  }

  order.orderStatus = status;
  await saveOrder(order);

  return formatOrder(order);

};



//----------------------------------------------------
// Formatter
//----------------------------------------------------

const formatOrder = (order, items = []) => {

  return {

    id: order.orderId,
    userId: order.userId,
    items,
    total: Number(order.totalAmount),
    status: order.orderStatus,
    createdAt: order.orderDate

  };

};