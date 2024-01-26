import React, { useEffect, useState } from "react";
import SprintCard from "../Card/SprintCard";
import "./SprintBoard.css";
import { MoreHorizontal } from "react-feather";
import SprintEditable from "../Editable/SprintEditable";
import SprintDropdown from "../Dropdown/SprintDropdown";
import { Droppable } from "react-beautiful-dnd";
import { Dropdown, Modal, Button, Form } from "react-bootstrap";
export default function Board(props) {
  const [show, setShow] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  useEffect(() => {
    console.log("Condition Met:", props.board.boardType);
    document.addEventListener("keypress", (e) => {
      if (e.code === "Enter") setShow(false);
    });
    return () => {
      document.removeEventListener("keypress", (e) => {
        if (e.code === "Enter") setShow(false);
      });
    };
  });
  const [modalData, setModalData] = useState({
    sprintStart: props.board.sprintStart,
    sprintEnd: props.board.sprintEnd,
    goal: props.board.goal,
  });

  const handleModalShow = () => {
    setModalShow(true);
  };

  const handleModalClose = () => {
    setModalShow(false);
  };
  const addCards = () => {};
  const handleInputChange = (field, value) => {
    console.log(value);
    setModalData({
      ...modalData,
      [field]: value,
    });
  };
  const handleModalSave = () => {
    props.onModalSave(props.id, modalData);
    setModalShow(false);
  };
  const completeBoard = () => {
    props.addBoard("New Sprint");
    props.updateBoard("completed", true, props.id);
  };
  const startBoard = () => {
    props.updateBoard("started", true, props.id);
  };
  return (
    <div className="board">
      <div className="board__top">
        {show ? (
          <div>
            <input
              className="title__input"
              type={"text"}
              defaultValue={props.name}
              onChange={(e) => {
                props.updateBoard("name", e.target.value, props.id);
              }}
            />
          </div>
        ) : (
          <div style={{ width: "200px" }}>
            <p
              onClick={() => {
                setShow(true);
              }}
              className="board__title"
              style={{ whiteSpace: "nowrap", overflow: "hidden" }}
            >
              {props?.name || "Name of Board"}
              <span className="total__cards">{props.card?.length}</span>
            </p>
          </div>
        )}
        {props.board.boardType !== "backlog" && (
          <Dropdown
            className="board__dropdown"
            show={dropdown}
            style={{ backgroundColor: "#F1F8F5" }}
            onClick={() => setDropdown(!dropdown)}
          >
            <Dropdown.Toggle as={MoreHorizontal}></Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => props.removeBoard(props.id)}>
                Delete Board
              </Dropdown.Item>
              <Dropdown.Item onClick={handleModalShow}>
                Edit Sprint
              </Dropdown.Item>
              {props.board.started === true && (
                <Dropdown.Item onClick={completeBoard}>
                  Complete Sprint
                </Dropdown.Item>
              )}

              {props.board.started === false && (
                <Dropdown.Item
                  onClick={() => props.updateBoard("started", true, props.id)}
                >
                  Start Sprint
                </Dropdown.Item>
              )}
              {/* Add more Dropdown.Items for other actions */}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      <Droppable droppableId={props.id.toString()}>
        {(provided) => (
          <div
            className="board__cards"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.card?.map((items, index) => (
              <SprintCard
                bid={props.id}
                id={items._id}
                index={index}
                key={items._id}
                title={items.cardName}
                tags={items.tags}
                task={items.task}
                updateCard={props.updateCard}
                removeCard={props.removeCard}
                card={items}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="board__footer">
        <SprintEditable
          name={"Add Card"}
          btnName={"Add Card"}
          placeholder={"Enter Card Title"}
          onSubmit={(value) => props.addCard(value, props.id)}
        />
      </div>
      <Modal show={modalShow} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Sprint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="sprintStart">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={modalData.sprintStart}
                onChange={(e) =>
                  handleInputChange("sprintStart", e.target.value)
                }
              />
            </Form.Group>
            <Form.Group controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={modalData.sprintEnd}
                onChange={(e) => handleInputChange("sprintEnd", e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="sprintGoal">
              <Form.Label>Sprint Goal</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={modalData.goal}
                onChange={(e) => handleInputChange("goal", e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
