import { FormGroup } from "@mui/material";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";
import styles from "../../styles/ReviewsEditCreateForm.module.css";

function ReviewEditForm(props) {
  const { id, setShowEditForm, setReviews } = props;

  const handleProductName = (event) => {
    setProductName(event.target.value);
  };

  const handleContent = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/reviews/${id}/`, {
        product_name: product_name.trim(),
        content: content.trim(),
      });
      setReviews((prevReviews) => ({
        ...prevReviews,
        results: prevReviews.results.map((review) => {
          return review.id === id
            ? {
                ...review,
                product_name: product_name.trim(),
                content: content.trim(),
                updated_at: "now",
              }
            : review;
        }),
      }));
      setShowEditForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Control
          className={styles.Form}
          as="textarea"
          name="product_name"
          value={product_name}
          onChange={handleProductName}
          rows={4}
        />
      </Form.Group>
      <FormGroup>
        <Form.Control
          className={styles.Form}
          as="textarea"
          name="content"
          value={content}
          onChange={handleContent}
          rows={4}
        />
      </FormGroup>
      <div className="text-right">
        <button
          className={styles.Button}
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          Cancel
        </button>
        <button
          className={styles.Button}
          disabled={!product_name.trim()}
          type="submit"
        >
          Save
        </button>
      </div>
    </Form>
  );
}

export default ReviewEditForm;
