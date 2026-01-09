import axios from 'axios';

/**
 * Enhances order items with proper product names
 * 
 * @param {Array} items - Order items to enhance with product names
 * @returns {Promise<Array>} - Enhanced items with product names
 */
export const enhanceOrderItems = async (items) => {
  if (!items || !Array.isArray(items)) return [];
  
  return Promise.all(
    items.map(async (item) => {
      try {
        if (item.customDetails) {
          const fabricName = item.customDetails.fabricName || '';
          const itemType = item.customDetails.itemType || 'Custom Item';
          const style = item.customDetails.style ? ` (${item.customDetails.style})` : '';
          return {
            ...item,
            productName: `${itemType}${style} - ${fabricName}`
          };
        }
        
        if (item.productName) {
          return item;
        }
        
        if (item.productId) {
          const productId = typeof item.productId === 'object' ? 
            item.productId._id : item.productId;
          
          try {
            const response = await axios.get(`https://istitch-backend.onrender.com/api/items/${productId}`);
            
            if (response.data && response.data.item && response.data.item.name) {
              return {
                ...item,
                productName: response.data.item.name
              };
            }
          } catch (fetchError) {
            console.log("Error fetching product, will use fallback name");
          }
        }
        
        if (item.name) {
          return {
            ...item,
            productName: item.name
          };
        }
        
        let fallbackName = "Product";
        
        if (item.productId) {
          const idStr = typeof item.productId === 'object' ? 
            (item.productId._id || '').substring(0, 6) : 
            (item.productId || '').substring(0, 6);
          fallbackName = `Product #${idStr}`;
        }
        
        if (item.size || item.selectedSize) {
          fallbackName += ` (${item.size || item.selectedSize})`;
        }
        
        return {
          ...item,
          productName: fallbackName
        };
      } catch (err) {
        console.error("Error enhancing order item:", err);
        return {
          ...item,
          productName: item.name || 'Product'
        };
      }
    })
  );
};

/**
 * Enhances an entire order with product details
 * 
 * @param {Object} order - Order object to enhance
 * @returns {Promise<Object>} - Enhanced order with product names
 */
export const enhanceOrderWithProductDetails = async (order) => {
  if (!order || !order.items) return order;
  
  const enhancedItems = await enhanceOrderItems(order.items);
  
  return {
    ...order,
    items: enhancedItems
  };
};

/**
 * Enhances multiple orders with product details
 * 
 * @param {Array} orders - Array of order objects to enhance
 * @returns {Promise<Array>} - Enhanced orders with product names
 */
export const enhanceOrdersWithProductDetails = async (orders) => {
  if (!orders || !Array.isArray(orders)) return [];
  
  return Promise.all(
    orders.map(order => enhanceOrderWithProductDetails(order))
  );
};
