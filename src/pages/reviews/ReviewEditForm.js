import { FormGroup } from "@mui/material";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";
import styles from "../../styles/ReviewsEditCreateForm.module.css";

function ReviewEditForm(props) {
  const { id, setShowEditForm, setReviews, product_name, 
    content, setProductName, setContent
   } = props;

   const [formProductName, setFormProductName] = useState(product_name);
   const [formContent, setFormContent] = useState(content)

  const handleProductName = (event) => {
    setFormProductName(event.target.value);
  };

  const handleContent = (event) => {
    setFormContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/reviews/${id}/`, {
        product_name: formProductName.trim(),
        content: formContent.trim(),
      });
      setReviews((prevReviews) => ({
        ...prevReviews,
        results: prevReviews.results.map((review) => {
          return review.id === id
            ? {
                ...review,
                product_name: formProductName.trim(),
                content: formContent.trim(),
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
          value={formProductName}
          onChange={handleProductName}
          rows={1}
        />
      </Form.Group>
      <FormGroup>
        <Form.Control
          className={styles.Form}
          as="textarea"
          name="content"
          value={formContent}
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
          disabled={!formProductName.trim()}
          type="submit"
        >
          Save
        </button>
      </div>
    </Form>
  );
}

export default ReviewEditForm;
