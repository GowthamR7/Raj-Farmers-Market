const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
    // ✅ Don't set default here - let pre-save hook handle it
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 50
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    default: 'cod'
  },
  notes: String
}, {
  timestamps: true
});

// ✅ CRITICAL: Pre-Save Hook for Auto-Generate Order Number
orderSchema.pre('save', async function(next) {
  try {
    // Only generate orderNumber for new documents
    if (this.isNew && !this.orderNumber) {
      console.log('🔢 Generating order number for new order...');
      
      // Method: Timestamp-based unique number
      const timestamp = Date.now();
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      this.orderNumber = `ORD${timestamp}${randomSuffix}`;
      
      console.log(`✅ Generated order number: ${this.orderNumber}`);
    }
    
    next();
  } catch (error) {
    console.error('❌ Error in order pre-save hook:', error);
    next(error);
  }
});

module.exports = mongoose.model('Order', orderSchema);
