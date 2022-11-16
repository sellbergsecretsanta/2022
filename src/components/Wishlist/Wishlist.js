import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

function Wishlist(props) {
    const [inputValue, setInputValue] = useState('')

    const handleAddClick = () => {
        props.onAddItem(props.child.id, inputValue);
        setInputValue("");
    }

    const handleRemoveClick = (itemId) => {
        props.onRemoveItem(props.child.id, itemId);
    }

    return(
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group className="mb-3 card-body" controlId="exampleForm.ControlTextarea1">
            <h4>{props.child.name}</h4>
            <div className="ml-4">
                {props.child.wishlist.map(item => (
                    <Form.Check key={`${props.child.id}${item.id}`} type={"checkbox"}>
                        <Form.Check.Input
                            id={item.id}
                            type={"checkbox"}
                            onChange={() => props.onUpdateWishlistItem(props.child.id, item.id)}
                            checked={item.owner !== null}
                            disabled={item.owner !== null && item.owner !== props.ownerId}
                        />
                        <Form.Check.Label
                            style={{textDecoration: (item.owner !== null && item.owner !== props.ownerId ? "line-through" : "none")}}
                            title={(item.owner !== null && item.owner !== props.ownerId ? "Någon har redan kryssat denna" : "")}
                            htmlFor={item.id}>
                            {item.text}
                        </Form.Check.Label>
                        {props.child.parents.includes(props.ownerId) && item.owner === null && (
                            <i
                                className="fa fa-trash-o pl-2"
                                onMouseOver={(e) => e.target.className = "fa fa-trash pl-2"}
                                onMouseOut={(e) => e.target.className = "fa fa-trash-o pl-2"}
                                style={{cursor: "pointer"}}
                                onClick={() => handleRemoveClick(item.id)}></i>
                        )}
                        {props.isSaving && JSON.stringify(props.isSaving) === JSON.stringify([props.child.id, item.id]) && (
                            <i className="fa fa-spinner fa-spin ml-2" />
                        )}
                    </Form.Check>
                ))}
            </div>
            {props.child.parents.includes(props.ownerId) && (
                <>
                    <InputGroup size="sm">
                        <Button
                            size="sm"
                            variant="outline-secondary"
                            id={`add${props.child.id}`}
                            disabled={props.isSaving}
                            onClick={() => handleAddClick()}>
                                {props.isSaving === props.child.id
                                ? <i className="fa fa-spinner fa-spin" />
                                : "Lägg till"}
                        </Button>
                        <Form.Control
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder=""
                            describedby={`add${props.child.id}`}
                        />
                    </InputGroup>
                </>
            )}
          </Form.Group>
        </Form>
    )
}

export default Wishlist