const mongoose = require('mongoose');

const OperationSchema = new mongoose.Schema({
  operationId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['إضافة', 'سحب', 'إسترجاع', 'إتلاف'],
    required: true
  },
  warehouse: {
    type: String,
    enum: ['durable', 'consumable', 'damaged'],
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  },
  source: {
    type: String
  },
  destination: {
    type: String
  },
  documentRef: {
    type: String
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to generate unique operation ID
OperationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Get the count of documents for the current year and month
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(`${year}-${month}-01`),
        $lt: new Date(month === '12' ? `${year + 1}-01-01` : `${year}-${parseInt(month) + 1}-01`)
      }
    });
    
    // Format: OP-YYYY-MM-XXXX
    this.operationId = `OP-${year}-${month}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

const Operation = mongoose.model('Operation', OperationSchema);
module.exports = Operation;