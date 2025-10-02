// Write your code here
import './index.css'
const SimilarProductItem = props => {
  const {itemDetails} = props
  const {brand, imageUrl, price, rating, style, title, totalReviews} =
    itemDetails
  return (
    <li className="similar-product-card">
      <img src={imageUrl} className="similar-product-image" alt="similar product" />
      <p className="similar-title-text">{title}</p>
      <p className="similar-brand-text">by {brand}</p>
      <div className="similar-rating-price-container">
        <p>Rs {price}/-</p>
        <div className="similar-details-rating-container">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-image"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
