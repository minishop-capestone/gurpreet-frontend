import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`https://gurpreet-backend.onrender.com/api/orders/user/${user.id}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [user.id]);

  return (
    <section className="py-24 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
        <h2 className="font-manrope font-bold text-4xl leading-10 text-black text-center">
          Order Summary
        </h2>
        <div className="main-box border border-gray-200 rounded-xl pt-6 max-w-xl max-lg:mx-auto lg:max-w-full">
          {orders.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="font-manrope font-bold text-2xl leading-10 text-gray-500">
                No orders found
              </h3>
            </div>
          ) : (
            orders.map(order => (
              <div key={order._id} className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200">
                  <div className="data">
                    <p className="font-semibold text-base leading-7 text-black">
                      Order Id: <span className="text-indigo-600 font-medium">#{order._id}</span>
                    </p>
                    <p className="font-semibold text-base leading-7 text-black mt-4">
                      Order Payment Status: <span className="text-gray-400 font-medium">{order.isPaid ? 'Paid' : 'Pending'}</span>
                    </p>
                  </div>
                </div>
                {order.cartItems.map(item => (
                  <div key={item.product._id} className="w-full px-3 min-[400px]:px-6">
                    <div className="flex flex-col lg:flex-row items-center py-6 border-b border-gray-200 gap-6 w-full">
                      <div className="img-box max-lg:w-full">
                        <img src={item.product.image} alt={item.product.name} className="aspect-square w-full lg:max-w-[140px] rounded-xl" />
                      </div>
                      <div className="flex flex-row items-center w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
                          <div className="flex items-center">
                            <div>
                              <h2 className="font-semibold text-xl leading-8 text-black mb-3">
                                {item.product.name}
                              </h2>
                              <p className="font-normal text-lg leading-8 text-gray-500 mb-3">
                                Qty: {item.qty}
                              </p>
                              <p className="font-medium text-base leading-7 text-black pr-4 mr-4 border-r border-gray-200">
                                Price: <span className="text-gray-500">${item.price}</span>
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-5">
                            <div className="col-span-5 lg:col-span-1 flex items-center max-lg:mt-3">
                              <div className="flex gap-3 lg:block">
                                <p className="font-medium text-sm leading-7 text-black">Total Price</p>
                                <p className="lg:mt-4 font-medium text-sm leading-7 text-indigo-600">${order.totalPrice}</p>
                              </div>
                            </div>
                            <div className="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3">
                              <div className="flex gap-3 lg:block">
                                <p className="font-medium text-sm leading-7 text-black">Status</p>
                                <p className={`font-medium text-sm leading-6 py-0.5 px-3 rounded-full lg:mt-3 ${order.isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                  {order.isPaid ? 'Paid' : 'Pending'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="my-10"></div> {/* Add some space between orders */}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default OrderPage;
