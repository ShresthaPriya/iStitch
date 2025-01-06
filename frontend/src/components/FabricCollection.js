import React from 'react';
// import { useNavigate } from 'react-router-dom';
import '../styles/FabricCollection.css';

function TrendingRecipe() {
//   const navigate = useNavigate();

//   const viewRecipe = (id) => {
//     navigate(`/recipe/${id}`);
  };


  return (
    <>
      <h3>Trending Recipes</h3>
      <div className="trending-recipes">
        <div className="recipe-card">
          <img src={require('../images/splash.jpg')} alt="Delicious Recipe 1" className="recipe-image" />
          <h3>Easy Baked Salmon</h3>
          <div className='info'>
            <p>102 ordered</p>
            <p>102 reviews</p>
            <p>4.5 ★</p>
          </div>
          <button onClick={() => viewRecipe('recipe-id-1')}>View Recipe</button>
        </div>
        <div className="recipe-card">
          <img src={require('../images/gingerbread-cupcakes.jpg')} alt="Gingerbread Cupcake" className="recipe-image" />
          <h3>Gingerbread Cupcake</h3>
          <div className='info'>
            <p>102 ordered</p>
            <p>102 reviews</p>
            <p>4.5 ★</p>
          </div>
          <button onClick={() => viewRecipe('recipe-id-1')}>View Recipe</button>
        </div>
        <div className="recipe-card">
          <img src={require('../images/hash-brown-omelet.webp')} alt="Hash Brown and Bacon Omelet" className="recipe-image" />
          <h3>Hash Brown and Bacon Omelet</h3>
          <div className='info'>
            <p>102 ordered</p>
            <p>102 reviews</p>
            <p>4.5 ★</p>
          </div>
          <button onClick={() => viewRecipe('recipe-id-1')}>View Recipe</button>
        </div>
    
      </div>
    </>
  );


export default TrendingRecipe;
