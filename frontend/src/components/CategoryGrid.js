// import React from "react";
// import "../styles/Products.css";

// const CategoryGrid = () => {
//   const items = [
//     {
//       title: "Shirts",
//       image: require("../images/ProductCatPictures/shirt.jpg"),
//       bgColor: "#ffccd5",
//     },
//     {
//       title: "Suits",
//       image: require("../images/ProductCatPictures/suits.jpg"),
//       description: "High quality custom-made suits.",
//       button: "Learn More",
//       bgColor: "#d6e6f2",
//       isLarge: true,
//     },
//     {
//       title: "Pants",
//       image: require("../images/ProductCatPictures/pants.jpg"),
//       bgColor: "#ffccd5",
//     },
//     {
//       title: "Kurta",
//       image: require("../images/ProductCatPictures/kurta.jpg"),
//       bgColor: "#fde2e4",
//     },
//     {
//       title: "Blouse",
//       image: require("../images/ProductCatPictures/blouse.jpg"),
//       bgColor: "#fde2e4",
//     },
//   ];

//   return (
//     <div className="products-container">
//       <h2 className="products-title">What we have</h2>
//       <div className="products-grid">
//         {items.map((item, index) => (
//           <div
//             key={index}
//             className={`product-card ${item.isLarge ? "large-card" : ""}`}
//             style={{ backgroundColor: item.bgColor }}
//           >
//             {item.isLarge ? (
//               <>
//                 <div className="product-content">
//                   <h3>{item.title}</h3>
//                   {item.description && <p>{item.description}</p>}
//                   {item.button && <button className="learn-more-btn">{item.button}</button>}
//                 </div>
//                 <img src={item.image} alt={item.title} />
//               </>
//             ) : (
//               <>
//                 <img src={item.image} alt={item.title} className="product-image" />
//                 <div className="product-content">
//                   <h3>{item.title}</h3>
//                 </div>
//               </>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CategoryGrid;
import React from "react";
import "../styles/Products.css";

const CategoryGrid = () => {
  const items = [
    { title: "Suits", image: require("../images/ProductCatPictures/suits.jpg") },
    { title: "Kurta", image: require("../images/ProductCatPictures/kurta.jpg") },
    { title: "Blouse", image: require("../images/ProductCatPictures/blouse.jpg") },
  ];

  return (
    <div className="products-container">
      <h2 className="products-title">What we have</h2>
      <div className="products-header">
        <a href="#viewAll" className="view-all-link">View all <span>▾</span></a>
      </div>
      <div className="products-grid">
        {items.map((item, index) => (
          <div key={index} className="product-card">
            <img src={item.image} alt={item.title} className="product-image" />
            <div className="product-title-container">
              <h3 className="product-title">{item.title}</h3>
              <div className="title-line"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
