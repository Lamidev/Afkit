const Cart = require("../../models/cart");
const Product = require("../../models/products");


const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, sessionId } = req.body;

    if (!productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Either userId or sessionId must be provided
   
    // Validate sessionId format if provided
    if (sessionId && !sessionId.startsWith('guest_')) {
      return res.status(400).json({
        success: false,
        message: "Invalid session ID format",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find cart by userId or sessionId
    let cart;
    if (userId) {
      cart = await Cart.findOne({ userId });
    } else {
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      cart = new Cart({ userId, sessionId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while adding product to cart",
    });
  }
};


const fetchCartItems = async (req, res) => {
  try {
    const { userId, sessionId } = req.query;

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: "Either userId or sessionId is required!",
      });
    }

    const query = userId ? { userId } : { sessionId };
    const cart = await Cart.findOne(query).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [] },
      });
    }

    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching cart items",
    });
  }
};

const mergeCarts = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required for merging carts!",
      });
    }

    // Optional: If you want sessionId to be required only when merging
    if (!sessionId) {
      return res.status(200).json({
        success: true,
        data: await Cart.findOne({ userId }) || { userId, items: [] },
      });
    }

    const userCart = await Cart.findOne({ userId });
    const guestCart = await Cart.findOne({ sessionId });

    if (!guestCart) {
      return res.status(200).json({
        success: true,
        data: userCart || { userId, items: [] },
      });
    }

    if (!userCart) {
      guestCart.userId = userId;
      guestCart.sessionId = undefined;
      await guestCart.save();
      return res.status(200).json({
        success: true,
        data: guestCart,
      });
    }

    // Merge items
    guestCart.items.forEach(guestItem => {
      const existingItem = userCart.items.find(
        item => item.productId.toString() === guestItem.productId.toString()
      );
      
      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    });

    await userCart.save();
    await Cart.deleteOne({ _id: guestCart._id });

    // Return populated cart
    await userCart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = userCart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...userCart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error merging carts",
    });
  }
};

  const updateCartItemQty = async (req, res) => {
    try {
      const { userId, productId, quantity, sessionId } = req.body;
  
     // Update the validation in updateCartItemQty
if ((!userId && !sessionId) || !productId || quantity <= 0) {
  return res.status(400).json({
    success: false,
    message: "Missing required fields: need either userId or sessionId, productId, and valid quantity",
    required: {
      identifier: "userId or sessionId",
      productId: true,
      quantity: "must be > 0"
    }
  });
}
  
      // Find cart by userId or sessionId
      const query = userId ? { userId } : { sessionId };
      const cart = await Cart.findOne(query);
  
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found!",
        });
      }
  
      // Find the item in the cart
      const findCurrentProductIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
  
      if (findCurrentProductIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Cart item not present!",
        });
      }
  
      // Update the quantity
      cart.items[findCurrentProductIndex].quantity = quantity;
      await cart.save();
  
      // Populate product details
      await cart.populate({
        path: "items.productId",
        select: "image title price salePrice",
      });
  
      const populateCartItems = cart.items.map((item) => ({
        productId: item.productId ? item.productId._id : null,
        image: item.productId ? item.productId.image : null,
        title: item.productId ? item.productId.title : "Product not found",
        price: item.productId ? item.productId.price : null,
        salePrice: item.productId ? item.productId.salePrice : null,
        quantity: item.quantity,
      }));
  
      res.status(200).json({
        success: true,
        data: {
          ...cart._doc,
          items: populateCartItems,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Some error occurred while updating cart item quantity",
      });
    }
  };
  const deleteCartItem = async (req, res) => {
    try {
      const { userId, productId, sessionId } = req.body;
  
      if ((!userId && !sessionId) || !productId) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: need either userId or sessionId and productId",
          required: {
            identifier: "userId or sessionId",
            productId: true
          }
        });
      }
      
  
      const query = userId ? { userId } : { sessionId };
      const cart = await Cart.findOne(query).populate({
        path: "items.productId",
        select: "image title price salePrice",
      });
  
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found!",
        });
      }
  
      cart.items = cart.items.filter(
        (item) => item.productId._id.toString() !== productId
      );
  
      await cart.save();
  
      const populateCartItems = cart.items.map((item) => ({
        productId: item.productId ? item.productId._id : null,
        image: item.productId ? item.productId.image : null,
        title: item.productId ? item.productId.title : "Product not found",
        price: item.productId ? item.productId.price : null,
        // salePrice: item.productId ? item.productId.salePrice : null,
        quantity: item.quantity,
      }));
  
      res.status(200).json({
        success: true,
        data: {
          ...cart._doc,
          items: populateCartItems,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Some error occurred while deleting cart",
      });
    }
  };
  
  module.exports = { addToCart, fetchCartItems, updateCartItemQty,mergeCarts, deleteCartItem };




