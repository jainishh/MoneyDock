import React, { useState, useRef } from "react";
import Draggable from "react-draggable";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, stockPrice }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [price, setPrice] = useState(stockPrice);
  const nodeRef = useRef(null);

  // Close popup window
  const handleClose = () => {
    setIsVisible(false);
  };

  // Handle Buy button
  const handleBuyClick = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/newOrders`,
        {
          name: uid,
          qty: stockQuantity,
          price: price,
          mode: "BUY",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => console.error("Error:", error));

    handleClose(); // auto-close after buy
  };

  // Handle Cancel button
  const handleCancelClick = () => {
    handleClose();
  };

  // If closed, don't render anything
  if (!isVisible) return null;

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-header"
      cancel=".no-drag" // prevents drag when tapping close or buttons
      enableUserSelectHack={false}
      touchAction="none"
    >
      <div ref={nodeRef} className="container" id="buy-window">
        {/* Header with close button */}
        <div
          className="drag-header"
          style={{
            cursor: "move",
            padding: "10px",
            background: "#e0e0e0",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Buy Window</span>
          <IconButton
            size="small"
            onClick={handleClose}
            onTouchStart={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </div>

        {/* Inputs */}
        <div className="regular-order">
          <div className="inputs">
            <fieldset>
              <legend>Qty.</legend>
              <input
                type="number"
                name="qty"
                id="qty"
                onChange={(e) => setStockQuantity(e.target.value)}
                value={stockQuantity}
                min="1"
              />
            </fieldset>
            <fieldset>
              <legend>Price</legend>
              <input
                type="number"
                name="price"
                id="price"
                step="0.05"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </fieldset>
          </div>
        </div>

        {/* Buttons */}
        <div className="buttons">
          <span>Margin required ₹{(stockQuantity * price).toFixed(2)}</span>
          <div className="btn-link">
            <Button
              type="button"
              className="btn"
              variant="contained"
              color="success"
              onClick={handleBuyClick}
            >
              Buy
            </Button>
            <Button
              type="button"
              className="btn"
              variant="contained"
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default BuyActionWindow;
