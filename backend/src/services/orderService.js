import {
  findOrders,
  findOrderById,
  createOrderRecord,
  createOrderDetail,
  saveOrder
} from "../repositories/order.repository.js";

import { findAddressById } from "../repositories/address.repository.js";
import db from '../models/index.js';

const ORDER_STATUSES = ['Pending', 'Processing', 'OutForDelivery', 'Delivered', 'Cancelled'];


//----------------------------------------------------
// Create Order
//----------------------------------------------------

export const createOrder = async ({
  userId,
  addressId,
  items,
  paymentMethod,
  addressData,
  total
}) => {

  let addressSnapshot = null;

  if (addressId) {
    const address = await findAddressById(addressId);
    if (!address) {
      throw new Error("Address not found");
    }

    addressSnapshot = {
      houseNumber: address.houseNumber,
      street: address.street,
      commune: address.commune,
      district: address.district,
      province: address.province
    };
  } else if (addressData) {
    addressSnapshot = {
      houseNumber: addressData.houseNumber ?? '',
      street: addressData.street ?? addressData.shippingAddress ?? '',
      commune: addressData.commune ?? '',
      district: addressData.district ?? '',
      province: addressData.province ?? addressData.shippingCity ?? ''
    };
  }

  const normalizedPaymentMethod = paymentMethod === 'cash'
    ? 'Cash on Delivery'
    : paymentMethod || 'Cash on Delivery';

  // Calculate total
  const orderTotal = Number(total ?? items.reduce((sum, item) => {

    const subtotal = Number(item.price) * Number(item.quantity);
    return sum + subtotal;

  }, 0));


  // Create order record
  const order = await createOrderRecord({

    userId,
    total: orderTotal,
    address: addressSnapshot,
    paymentMethod: normalizedPaymentMethod,
    paymentStatus: 'Unpaid'

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
    formatOrder(order, order.Order_details || [])
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

export const getOrderById = async(orderId)=>{
  return getOrder(orderId);
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
  if (!ORDER_STATUSES.includes(status)) throw new Error('Invalid order status.');
  return db.sequelize.transaction(async (transaction) => {
    const order = await db.Order.findByPk(Number(orderId), {
      include: [{ model: db.Order_detail }],
      lock: transaction.LOCK.UPDATE,
      transaction,
    });
    if (!order) return null;
    if (!order.inventoryDeducted && ['Processing', 'OutForDelivery', 'Delivered'].includes(status)) {
      for (const item of order.Order_details) {
        const inventory = await db.Inventory.findOne({ where: { productId: item.productId }, lock: transaction.LOCK.UPDATE, transaction });
        if (!inventory || Number(inventory.stockQuantity) < Number(item.quantity)) {
          throw new Error('Insufficient stock to process this order.');
        }
        await inventory.update({ stockQuantity: Number(inventory.stockQuantity) - Number(item.quantity), lastUpdated: new Date() }, { transaction });
      }
      await order.update({ inventoryDeducted: true }, { transaction });
    }
    await order.update({ orderStatus: status }, { transaction });
    return formatOrder(order, order.Order_details);
  });

};



//----------------------------------------------------
// Formatter
//----------------------------------------------------

const formatOrder = (order, items = []) => {

  return {

    id: order.orderId,
    userId: order.userId,
    items: items.map((item) => ({ productId: item.productId, quantity: item.quantity, price: Number(item.unitPrice), subtotal: Number(item.subTotal) })),
    total: Number(order.totalAmount),
    status: order.orderStatus,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    createdAt: order.orderDate

  };

};
