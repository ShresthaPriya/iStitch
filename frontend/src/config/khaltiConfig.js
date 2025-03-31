// Configuration for Khalti Payment Gateway
const khaltiConfig = {
  publicKey: "efbf264218eb46cf91d00c9d36b2d42b", // Use test key provided
  productIdentity: "iStitch", // This can be dynamic based on your app
  productName: "iStitch Custom Clothing",
  productUrl: "http://localhost:3000",
  eventHandler: {
    onSuccess: function (payload) {
      // Handle successful payment - params will be passed from the component
      console.log("Payment successful:", payload);
    },
    onError: function (error) {
      console.error("Khalti payment error:", error);
      alert("Payment failed. Please try again.");
    },
    onClose: function () {
      console.log("Khalti payment widget closed");
    }
  }
};

export default khaltiConfig;
