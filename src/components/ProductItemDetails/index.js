// Write your code here
import Cookies from 'js-cookie'
import {Component} from 'react'
import Header from '../Header'
import {BsFillStarFill} from 'react-icons/bs'
import {BsPlusSquare} from 'react-icons/bs'
import {BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import './index.css'
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class ProductItemDetails extends Component {
  state = {
    currentProduct: {},
    apiStatus: apiStatusConstants.initial,
    quantityCount: 1,
    similarProducts: [],
  }
  componentDidMount() {
    this.getProductDetails()
  }
  formattedData = data => {
    return {
      availability: data.availability,
      brand: data.brand,
      description: data.description,
      id: data.id,
      imageUrl: data.image_url,
      price: data.price,
      rating: data.rating,
      style: data.style,
      title: data.title,
      totalReviews: data.total_reviews,
    }
  }
  onDecrement = () => {
    const {quantityCount} = this.state
    if (quantityCount > 1) {
      this.setState(prevState => ({quantityCount: prevState.quantityCount - 1}))
    }
  }
  onIncrement = () => {
    this.setState(prevState => ({quantityCount: prevState.quantityCount + 1}))
  }
  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {id} = match.params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.formattedData(data)
      const similarFormattedData = data.similar_products.map(eachItem =>
        this.formattedData(eachItem),
      )
      this.setState({
        apiStatus: apiStatusConstants.success,
        currentProduct: updatedData,
        similarProducts: similarFormattedData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }
  renderSuccessView = () => {
    const {currentProduct, quantityCount, similarProducts} = this.state
    const {
      availability,
      brand,
      description,
      id,
      imageUrl,
      price,
      rating,
      style,
      title,
      totalReviews,
    } = currentProduct
    return (
      <>
        <div className="details-sub-container">
          <div className="img-container">
            <img
              src={imageUrl}
              className="product-details-image"
              alt="product"
            />
          </div>
          <div className="details-text-container">
            <h1 className="title-header">{title}</h1>
            <p className="price-text">Rs {price}/-</p>
            <div className="reviews-main-container">
              <div className="reviews-container">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-image"
                />
              </div>
              <p>{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>Available: {availability}</p>
            <p>Brand: {brand}</p>
            <hr className="horizontal-line" />
            <div className="quantity-container">
              <button data-testid="minus" onClick={this.onDecrement}>
                <BsDashSquare />
              </button>
              <p>{quantityCount}</p>
              <button data-testid="plus" onClick={this.onIncrement}>
                <BsPlusSquare />
              </button>
            </div>
            <button className="cart-button">Add To Cart</button>
          </div>
        </div>
        <div className="similar-products-main-container">
          <h1>Similar Products</h1>
          <ul className="similar-products-list">
            {similarProducts.map(each => (
              <SimilarProductItem itemDetails={each} key={each.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }
  renderProgressView = () => {
    return (
      <div data-testid="loader" className="loader-container">
        <Loader type="ThreeDots" height={50} width={50} />
      </div>
    )
  }
 
  renderFailureView = () => (
    <div className="failure-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )
  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderProgressView()
      default:
        return null
    }
  }
  render() {
    return (
      <div className="details-main-container">
        <Header />
        <div>{this.renderProductDetails()}</div>
      </div>
    )
  }
}

export default ProductItemDetails
