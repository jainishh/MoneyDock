import React, { useState, useRef } from "react";
import Draggable from "react-draggable";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const SellActionWindow = ({ uid, stockPrice, stockQty = 1 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [stockQuantity, setStockQuantity] = useState(stockQty);
  const nodeRef = useRef(null);

  //  Close popup
  const handleClose = () => {
    setIsVisible(false);
  };

  // Handle Sell button
  const handleSellClick = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.post(
        `${process.env.REACT_APP_API_URL}/newOrders`,
        {
          name: uid,
          qty: stockQuantity,
          price: stockPrice,
          mode: "SELL",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleClose();
      window.location.reload();
      // Optionally trigger a refresh of holdings/positions here
    } catch (err) {
      alert("Sell failed!");
    }
  };

  //  Handle Cancel button
  const handleCancelClick = () => {
    handleClose();
  };

  //  Don't render if closed
  if (!isVisible) return null;

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-header"
      cancel=".no-drag" // prevents drag when tapping close or buttons
      enableUserSelectHack={false}
      touchAction="none"
    >
      <div ref={nodeRef} className="container" id="sell-window">
        {/* Header with Close Button */}
        <div
          className="drag-header"
          style={{
            cursor: "move",
            padding: "10px",
            background: "#f8d7da",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Sell Window</span>
          <IconButton
            size="small"
            onClick={handleClose}
            onTouchStart={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </div>

        {/* Sell Info */}
        <div className="sellingInfo">
          <p>Qty held: {stockQty}</p>
          <p>Current Price: ₹{stockPrice}</p>
        </div>

        {/* Input Section */}
        <div className="regular-order">
          <div className="inputs">
            <fieldset>
              <legend>Qty.</legend>
              <input
                type="number"
                name="qty"
                id="qty"
                min="1"
                onChange={(e) => setStockQuantity(e.target.value)}
                value={stockQuantity}
              />
            </fieldset>
          </div>
        </div>

        {/* Buttons */}
        <div className="buttons">
          <div className="btn-link">
            <Button
              className="btn"
              variant="contained"
              color="error"
              onClick={handleSellClick}
            >
              Sell
            </Button>
            <Button
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

export default SellActionWindow;
