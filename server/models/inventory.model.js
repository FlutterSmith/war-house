const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  warehouse: {
    type: String,
    required: true,
    enum: ['durable', 'consumable', 'damaged'],
    default: 'consumable'
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  },
  minQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['متوفر', 'غير متوفر', 'انخفاض المخزون'],
    default: 'متوفر'
  },
  location: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update inventory status based on quantity
InventorySchema.pre('save', function(next) {
  if (this.isModified('quantity')) {
    this.lastUpdate = Date.now();
    
    if (this.quantity <= 0) {
      this.status = 'غير متوفر';
    } else if (this.quantity <= this.minQuantity) {
      this.status = 'انخفاض المخزون';
    } else {
      this.status = 'متوفر';
    }
  }
  
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  next();
});

const Inventory = mongoose.model('Inventory', InventorySchema);
module.exports = Inventory;