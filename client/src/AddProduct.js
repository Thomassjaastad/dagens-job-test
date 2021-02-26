import React, { Component } from "react";
import axios from "axios";

var ID = function () {
  return (
    Math.random().toString(36).substr(2, 8) +
    "-" +
    Math.random().toString(36).substr(2, 4) +
    "-" +
    Math.random().toString(36).substr(2, 4) +
    "-" +
    Math.random().toString(36).substr(2, 4) +
    "-" +
    Math.random().toString(36).substr(2, 12)
  );
};

class AddProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: ID(),
      name: "",
      category: "",
      price: "",
    };
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleNumberChange = (event) => {
    this.setState({
      [event.target.name]: parseInt(event.target.value),
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { id, name, category, price } = this.state;
    const product = {
      id,
      name,
      category,
      price,
    };
    axios
      .post("http://0.0.0.0:3001/createproduct", product)
      .then(() => console.log("product Created"))
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    return (
      <>
        <h3>Add product form</h3>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Enter name"
            name="name"
            onChange={this.handleInputChange}
          />
          <br />
          <p>
            Select a category:
            <br />
            <input
              type="radio"
              id="greens"
              name="category"
              value="greens"
              onChange={this.handleInputChange}
            />
            <label>Greens</label>
            <br />
            <input
              type="radio"
              id="fish"
              name="category"
              value="fish"
              onChange={this.handleInputChange}
            />
            <label htmlFor="fish">Fish</label>
            <br />
            <input
              type="radio"
              id="meat"
              name="category"
              value="meat"
              onChange={this.handleInputChange}
            />
            <label htmlFor="meat">Meat</label>
            <br />
          </p>
          <input
            type="number"
            name="price"
            placeholder="Enter price"
            onChange={this.handleNumberChange}
          />
          <br />
          <br />
          <button type="submit" onClick={this.handleInputChange}>
            Add product
          </button>
        </form>
      </>
    );
  }
}

export default AddProduct;
