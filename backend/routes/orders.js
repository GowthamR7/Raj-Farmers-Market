const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Create new order
// Enhanced validation and error responses
router.post('/', auth, async (req, res) => {
    try {
      console.log('=== ORDER CREATION WITH PRODUCT VALIDATION ===');
      console.log('User:', req.user.email);
      console.log('Request items:', JSON.stringify(req.body.items, null, 2));
      
      const { items, deliveryAddress, notes, paymentMethod } = req.body;
      
      // Basic validation
      if (req.user.role !== 'customer') {
        return res.status(403).json({ 
          success: false,
          message: 'Only customers can place orders' 
        });
      }
  
      if (!items || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Order must contain at least one item'
        });
      }
  
      // ✅ GET ALL AVAILABLE PRODUCTS FOR DEBUGGING
      const allProducts = await Product.find({});
      console.log('\n🔍 Available products in database:');
      allProducts.forEach((p, index) => {
        console.log(`  ${index + 1}. "${p.name}" (ID: ${p._id}, Stock: ${p.quantity})`);
      });
  
      // ✅ ENHANCED PRODUCT VALIDATION WITH MULTIPLE SEARCH METHODS
      let totalAmount = 0;
      const orderItems = [];
      const productErrors = [];
  
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log(`\n🔍 Validating item ${i + 1}:`);
        console.log(`  Requested: "${item.productName}" (ID: ${item.productId})`);
        
        try {
          let product = null;
          
          // Method 1: Search by ID (primary)
          if (item.productId) {
            product = await Product.findById(item.productId);
            console.log(`  ✓ ID Search Result: ${product ? `Found "${product.name}"` : 'Not Found'}`);
          }
          
          // Method 2: Exact name search (fallback)
          if (!product && item.productName) {
            product = await Product.findOne({ name: item.productName });
            console.log(`  ✓ Exact Name Search: ${product ? `Found "${product.name}"` : 'Not Found'}`);
          }
          
          // Method 3: Case-insensitive search
          if (!product && item.productName) {
            product = await Product.findOne({ 
              name: new RegExp(`^${item.productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') 
            });
            console.log(`  ✓ Case-insensitive Search: ${product ? `Found "${product.name}"` : 'Not Found'}`);
          }
          
          // Method 4: Partial match search (last resort)
          if (!product && item.productName) {
            const searchTerm = item.productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            product = await Product.findOne({ 
              name: new RegExp(searchTerm, 'i') 
            });
            console.log(`  ✓ Partial Match Search: ${product ? `Found "${product.name}"` : 'Not Found'}`);
          }
  
          // ✅ FINAL VALIDATION
          if (!product) {
            const availableNames = allProducts.map(p => `"${p.name}"`).join(', ');
            const error = `Product "${item.productName}" not found in database. Available products: ${availableNames}`;
            productErrors.push(error);
            console.log(`  ❌ FINAL RESULT: ${error}`);
            continue;
          }
  
          console.log(`  ✅ SUCCESS: Found "${product.name}" (ID: ${product._id})`);
  
          // Stock validation
          if (product.quantity < item.quantity) {
            const error = `Insufficient stock for "${product.name}". Available: ${product.quantity}, Requested: ${item.quantity}`;
            productErrors.push(error);
            console.log(`  ❌ STOCK ERROR: ${error}`);
            continue;
          }
  
          // Add to order items
          const itemTotal = product.price * item.quantity;
          totalAmount += itemTotal;
  
          orderItems.push({
            product: product._id,
            productName: product.name, // Use actual name from database
            quantity: item.quantity,
            price: product.price,
            unit: product.unit,
            farmer: product.farmer
          });
  
          console.log(`  ✅ VALIDATED: ${product.name} x${item.quantity} = ₹${itemTotal}`);
        } catch (error) {
          const errorMsg = `Database error for "${item.productName}": ${error.message}`;
          productErrors.push(errorMsg);
          console.error(`  ❌ DATABASE ERROR: ${errorMsg}`);
        }
      }
  
      // Handle product validation errors
      if (productErrors.length > 0) {
        console.log('\n❌ PRODUCT VALIDATION FAILED:');
        productErrors.forEach((error, index) => console.log(`  ${index + 1}. ${error}`));
        
        return res.status(400).json({
          success: false,
          message: 'Product validation failed',
          errors: productErrors,
          availableProducts: allProducts.map(p => ({
            name: p.name,
            _id: p._id,
            stock: p.quantity,
            price: p.price,
            category: p.category
          })),
          debug: {
            requestedItems: items.map(i => ({ name: i.productName, id: i.productId })),
            totalAvailableProducts: allProducts.length
          }
        });
      }
  
      console.log(`\n✅ ALL PRODUCTS VALIDATED SUCCESSFULLY. Total: ₹${totalAmount}`);
  
      // Create order (existing logic)
      const order = new Order({
        customer: req.user.userId,
        items: orderItems,
        totalAmount,
        deliveryAddress,
        paymentMethod: paymentMethod || 'cod',
        paymentStatus: 'pending',
        notes: notes || ''
      });
  
      await order.save();
      console.log(`✅ Order created successfully: ${order.orderNumber}`);
  
      // Update stock
      for (const orderItem of orderItems) {
        await Product.findByIdAndUpdate(
          orderItem.product,
          { $inc: { quantity: -orderItem.quantity } },
          { new: true }
        );
        console.log(`📦 Stock updated for ${orderItem.productName}`);
      }
      
      // Populate response
      await order.populate([
        { path: 'customer', select: 'name email phone' },
        { path: 'items.farmer', select: 'name email phone' }
      ]);
  
      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order: {
          orderNumber: order.orderNumber,
          _id: order._id,
          totalAmount: order.totalAmount,
          deliveryFee: order.deliveryFee,
          status: order.status,
          paymentStatus: order.paymentStatus,
          items: order.items,
          deliveryAddress: order.deliveryAddress,
          createdAt: order.createdAt
        }
      });
  
    } catch (error) {
      console.error('❌ CRITICAL ORDER ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during order creation',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
      });
    }
  });
  
  

// Get customer orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find({ customer: req.user.userId })
      .populate('items.farmer', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get farmer orders
router.get('/farmer-orders', auth, async (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find({
      'items.farmer': req.user.userId
    })
    .populate('customer', 'name email phone')
    .sort({ createdAt: -1 });

    // Filter items that belong to this farmer
    const filteredOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.filter(item => 
        item.farmer.toString() === req.user.userId
      )
    }));

    res.json(filteredOrders);
  } catch (error) {
    console.error('Error fetching farmer orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (farmers only)
router.patch('/:orderId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Only farmers can update order status' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if farmer has items in this order
    const hasItems = order.items.some(item => 
      item.farmer.toString() === req.user.userId
    );

    if (!hasItems) {
      return res.status(403).json({ 
        message: 'You can only update orders containing your products' 
      });
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
