const Product = require("../models/Product");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory for products
const createUploadDir = () => {
  const productDir = path.join(__dirname, "../uploads/products");
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir, { recursive: true });
  }
  return productDir;
};

// Multer configuration for product images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = createUploadDir();
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Images only! (jpeg, jpg, png, webp)"));
    }
  }
});

// @desc Add new product
// @route POST /api/products
// @access Private
const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      price,
      originalPrice,
      stock,
      unit,
      location,
      specifications,
      tags,
      discount
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !type || !price || !stock || !unit) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Process uploaded images
    const images = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];
    
    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required"
      });
    }

    // Parse JSON fields if they're strings
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
    const parsedSpecs = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    const parsedDiscount = typeof discount === 'string' ? JSON.parse(discount) : discount;

    const product = new Product({
      title: title.trim(),
      description: description.trim(),
      category,
      type,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      stock: parseInt(stock),
      unit,
      images,
      sellerId: req.user.id,
      location: parsedLocation || {},
      specifications: parsedSpecs || {},
      tags: parsedTags || [],
      discount: parsedDiscount || {}
    });

    await product.save();

    // Populate seller information
    await product.populate('sellerId', 'name email village district state');

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product
    });

  } catch (error) {
    console.error("Add Product Error:", error);
    
    // Clean up uploaded files if product creation fails
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, "../uploads/products", file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message
    });
  }
};

// @desc Get all products with filters
// @route GET /api/products
// @access Public
const getProducts = async (req, res) => {
  try {
    const {
      type,
      category,
      search,
      minPrice,
      maxPrice,
      location,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12,
      sellerId
    } = req.query;

    // Build filter object
    const filter = { isActive: true, isApproved: true };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (sellerId) filter.sellerId = sellerId;

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Location filter
    if (location) {
      const locationParts = location.split(',');
      if (locationParts.length >= 2) {
        filter.$or = [
          { "location.district": { $regex: locationParts[0].trim(), $options: "i" } },
          { "location.state": { $regex: locationParts[1].trim(), $options: "i" } }
        ];
      }
    }

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('sellerId', 'name village district state')
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProducts: total,
          hasNext: skip + products.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

// @desc Get single product by ID
// @route GET /api/products/:id
// @access Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'name email phone village district state createdAt')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (!product.isActive || !product.isApproved) {
      return res.status(404).json({
        success: false,
        message: "Product not available"
      });
    }

    // Increment views count
    await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message
    });
  }
};

// @desc Update product
// @route PUT /api/products/:id
// @access Private (Owner only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check if user is the owner of the product
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own products"
      });
    }

    const updateData = { ...req.body };

    // Process new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
      updateData.images = [...product.images, ...newImages];
    }

    // Parse JSON fields if they're strings
    if (updateData.location && typeof updateData.location === 'string') {
      updateData.location = JSON.parse(updateData.location);
    }
    if (updateData.specifications && typeof updateData.specifications === 'string') {
      updateData.specifications = JSON.parse(updateData.specifications);
    }
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = JSON.parse(updateData.tags);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('sellerId', 'name email village district state');

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });

  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message
    });
  }
};

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private (Owner only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check if user is the owner of the product
    if (product.sellerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own products"
      });
    }

    // Soft delete by setting isActive to false
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message
    });
  }
};

// @desc Get user's products (seller dashboard)
// @route GET /api/products/my-products
// @access Private
const getMyProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = 'all'
    } = req.query;

    const filter = { sellerId: req.user.id };
    
    if (status !== 'all') {
      filter.isActive = status === 'active';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProducts: total
        }
      }
    });

  } catch (error) {
    console.error("Get My Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your products",
      error: error.message
    });
  }
};

// @desc Get product categories and their counts
// @route GET /api/products/categories
// @access Public
const getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    
    const matchStage = { isActive: true, isApproved: true };
    if (type) matchStage.type = type;

    const categories = await Product.aggregate([
      { $match: matchStage },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getCategories,
  upload
};
