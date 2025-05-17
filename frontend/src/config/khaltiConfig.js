// This file is no longer needed as we've switched to server-side integration
// Keep for reference only
const khaltiConfig = (totalPrice, onSuccessCallback) => ({
    publicKey: "test_public_key_efbf264218eb46cf91d00c9d36b2d42b", // Use test public key for testing
    productIdentity: "iStitch",
    productName: "iStitch Custom Clothing",
    productUrl: "http://localhost:3000",
    eventHandler: {
        onSuccess: onSuccessCallback,
        onError: (error) => {
            console.error("Khalti Payment Error:", error);
            alert("Payment failed. Please try again.");
        },
        onClose: () => {
            console.log("Khalti Payment Widget Closed");
        }
    }
});

export default khaltiConfig;