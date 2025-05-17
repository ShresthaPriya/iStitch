import { useState, useEffect } from "react"
import axios from "axios"
import SplashNavbar from "../components/SplashNavbar"
import Footer from "../components/Footer"
import "../styles/CategoryPage.css"

const SplashMensPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/items/category/67da68cc5bdd84464f2494c4`)
        setItems(response.data.items || [])
      } catch (err) {
        console.error("Error fetching items:", err)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  // Simple function to get a material type
  const getMaterial = (index) => {
    const materials = ["Pure Wool", "Cotton", "Linen", "Wool Blend"]
    return materials[index % materials.length]
  }

  return (
    <>
      <SplashNavbar />
      <div className="category-page">
        <h2>Men's Clothing</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="items-grid">
            {items.map((item, index) => (
              <div key={item._id} className="item-card">
                <img src={`http://localhost:4000/images/${item.images[0]}`} alt={item.name} />
                <span className="material">{getMaterial(index)}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p className="price">Rs.{item.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default SplashMensPage

