const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc Get user's cart
// @route GET /api/cart
// @access Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id })
      .populate({
        path: 'items.productId',
        select: 'title price images stock unit sellerId isActive finalPrice',
        populate: {
          path: 'sellerId',
          select: 'name village district state'
        }
      });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
      await cart.save();
    }

    // Filter out inactive products and calculate totals
    const activeItems = cart.items.filter(item => 
      item.productId && item.productId.isActive
    );

    // Update cart if items were filtered out
    if (activeItems.length !== cart.items.length) {
      cart.items = activeItems;
      await cart.save();
    }

    // Calculate cart totals
    let subtotal = 0;
    let totalItems = 0;

    const itemsWithCalculations = activeItems.map(item => {
      const product = item.productId;
      const itemTotal = product.finalPrice * item.quantity;
      subtotal += itemTotal;
      totalItems += item.quantity;

      return {
        _id: item._id,
        productId: product._id,
        title: product.title,
        price: product.price,
        finalPrice: product.finalPrice,
        images: product.images,
        stock: product.stock,
        unit: product.unit,
        quantity: item.quantity,
        itemTotal,
        addedAt: item.addedAt,
        seller: product.sellerId,
        selectedVariant: item.selectedVariant
      };
    });

    // Estimated delivery charges and taxes
    const deliveryCharges = subtotal > 500 ? 0 : 50;
    const taxes = Math.round(subtotal * 0.05); // 5% GST
    const total = subtotal + deliveryCharges + taxes;

    res.json({
      success: true,
      data: {
        items: itemsWithCalculations,
        summary: {
          subtotal,
          deliveryCharges,
          taxes,
          total,
          totalItems,
          savings: 0 // Can be calculated based on original prices
        }
      }
    });

  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error.message
    });
  }
};

// @desc Add item to cart
// @route POST /api/cart/add
// @access Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, selectedVariant = {} } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    // Validate product
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found or not available"
      });
    }

    // Check if user is trying to add their own product
    if (product.sellerId.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot add your own product to cart"
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add ${quantity} more items. Only ${product.stock - cart.items[existingItemIndex].quantity} more available`
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].addedAt = new Date();
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity,
        selectedVariant,
        addedAt: new Date()
      });
    }

    await cart.save();

    // Return updated cart
    const updatedCart = await Cart.findOne({ userId: req.user.id })
      .populate({
        path: 'items.productId',
        select: 'title price images stock unit finalPrice',
        populate: {
          path: 'sellerId',
          select: 'name'
        }
      });

    res.json({
      success: true,
      message: "Item added to cart successfully",
      data: updatedCart
    });

  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
      error: error.message
    });
  }
};

// @desc Update cart item quantity
// @route PUT /api/cart/update
// @access Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID and quantity are required"
      });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    if (quantity === 0) {
      // Remove item from cart
      cart.items = cart.items.filter(item => 
        item.productId.toString() !== productId
      );
    } else {
      // Validate stock
      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }

      // Update quantity
      const itemIndex = cart.items.findIndex(item => 
        item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        return res.status(404).json({
          success: false,
          message: "Item not found in cart"
        });
      }
    }

    await cart.save();

    res.json({
      success: true,
      message: "Cart updated successfully",
      data: cart
    });

  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message
    });
  }
};

// @desc Remove item from cart
// @route DELETE /api/cart/remove/:productId
// @access Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    // Remove item
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => 
      item.productId.toString() !== productId
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: "Item removed from cart successfully"
    });

  } catch (error) {
    console.error("Remove from Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
      error: error.message
    });
  }
};

// @desc Clear entire cart
// @route DELETE /api/cart/clear
// @access Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.estimatedTotal = 0;
    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared successfully"
    });

  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message
    });
  }
};

// @desc Get cart item count
// @route GET /api/cart/count
// @access Private
const getCartCount = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    
    const count = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

    res.json({
      success: true,
      data: { count }
    });

  } catch (error) {
    console.error("Get Cart Count Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get cart count",
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
};
