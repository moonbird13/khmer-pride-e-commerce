import db from '../models/index.js';
const { Order, Order_detail } = db;

//----------------------------------------------------
// Select Or Search
// ---------------------------------------------------

//Find all orders
export const findOrders = async(userId)=>{

  const where = userId? { userId:Number(userId) }: {};

  return await Order.findAll({
    where,
    order:[["orderId","DESC"]]
  });

};

//Find order by id
export const findOrderById = async(orderId)=>{
  return await Order.findByPk(Number(orderId));
}


//-----------------------------------------------------
// Create
// -----------------------------------------------------

//Create order record
export const createOrderRecord = async ({
  userId,
  total,
  address
}) => {

  return await Order.create({
    userId: Number(userId),
    orderDate: new Date(),
    totalAmount: Number(total),
    orderStatus: "Pending",
    shippingHouseNumber: address?.houseNumber,
    shippingStreet: address?.street,
    shippingCommune: address?.commune,
    shippingDistrict: address?.district,
    shippingProvince: address?.province
  });
};

//create order detail
export const createOrderDetail = async ({
  orderId,
  productId,
  quantity,
  unitPrice,
  subTotal
}) => {
  return await Order_detail.create({
    orderId: Number(orderId),
    productId: Number(productId),
    quantity: Number(quantity),
    unitPrice: Number(unitPrice),
    subTotal: Number(subTotal)
  });
};

//save order
export const saveOrder = async (order) => {
  return await order.save();
}



export default {
  findOrders,
  findOrderById,
  createOrderRecord,
  createOrderDetail,
  saveOrder
};
