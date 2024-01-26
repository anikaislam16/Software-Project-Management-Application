import React, { useEffect, useState } from "react";

import {
  CheckSquare,
  CreditCard,
  Paperclip,
  Tag,
  Trash,
  User,
  X,
} from "react-feather";
import { v4 as uuidv4 } from "uuid";
import SprintEditable from "../../Editable/SprintEditable";
import SprintLabel from "../../Label/SprintLabel";
import SprintModal from "../../Modal/SprintModal";
import "./SprintCardDetails.css";
import { useParams } from "react-router-dom";
import ActivitySelector from "./AcitivityButton/ActivitySelector";
import EditableHeader from "../../../../kanban/board/components/Card/CardDetails/tasklist/EditableHeader";
import StartDateButton from "../../../../kanban/board/components/Card/CardDetails/Date/StartDateButton";
import PrioritySelector from "../../../../kanban/board/components/Card/CardDetails/priorityButtons/PrioritySelector";
import CardMember from "./CardMember";
export default function SprintCardDetails(props) {
  const colors = ["#61bd4f", "#f2d600", "#ff9f1a", "#eb5a46", "#c377e0"];
  const { projectId } = useParams();
  const [values, setValues] = useState({ ...props.card });
  const [input, setInput] = useState(false);
  const [text, setText] = useState(values.cardName);
  const [labelShow, setLabelShow] = useState(false);
  const [isMemberVisible, setIsMemberVisible] = useState(false);
  const Input = (props) => {
    return (
      <div className="">
        <input
          autoFocus
          defaultValue={text}
          type={"text"}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </div>
    );
  };

  const addTask = async (value) => {
    try {
      // Assuming values and setValues are state variables
      // and updateCardItemApi is the API endpoint for updating a card item
      // Prepare the task object without the id
      const newTaskWithoutId = {
        taskName: value,
        completed: false,
      };
      console.log(props.card);
      // Make the API request to update the card item
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}/${props.bid}/${props.card._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fieldName: "task",
            newValue: {
              taskName: value,
              complete: false,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update card item: ${response.statusText}`);
      }

      // Parse the JSON from the response, which should contain the new id
      const resultData = await response.json();
      console.log(resultData);
      // Add the id to the new task
      const taskId = resultData.newSubDocumentId; // Replace 'id' with the actual property name in the result

      // Create the complete task object with the id
      const newTask = {
        id: taskId,
        taskName: value,
        completed: false,
      };

      // Update the state with the new task and result data
      setValues((prevValues) => ({
        ...prevValues,
        task: [...prevValues.task, newTask],
        // Add this line to store the result data in state
      }));
      console.log(values);
    } catch (error) {
      console.error("Error adding task:", error);

      // Handle errors appropriately, for example, show a notification to the user
      // You might want to use a state variable to store and display error messages
    }
  };
  const removeTask = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}/${props.bid}/${props.card._id}/task/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.statusText}`);
      }

      // Assuming taskId is part of your state
      // Filter out the deleted task from your state
      setValues((prevValues) => ({
        ...prevValues,
        task: prevValues.task.filter((task) => task._id !== id),
      }));

      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error.message);

      // Handle errors appropriately, for example, show a notification to the user
      // You might want to use a state variable to store and display error messages
    }
  };

  const deleteAllTask = () => {
    setValues({
      ...values,
      task: [],
    });
  };

  const handleTaskClick = async (id, updatedValue) => {
    console.log(id);

    const response = await fetch(
      `http://localhost:3010/projects/scrum/${projectId}/${props.bid}/${props.card._id}/task/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskName: updatedValue,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed t update task :${response.statusText}`);
    }
    const resultData = await response.json();
    console.log("fella", resultData);
    setValues((prevValues) => {
      if (prevValues && prevValues.task && Array.isArray(prevValues.task)) {
        const updatedTasks = prevValues.task.map((task) =>
          task.id === id ? { ...task, taskName: updatedValue } : task
        );
        return {
          ...prevValues,
          task: updatedTasks,
        };
      } else {
        console.error("Invalid values structure:", prevValues);
        // Handle the error or return a default value as needed
        return prevValues;
      }
    });
  };

  const updateTask = async (id) => {
    const taskIndex = values.task.findIndex((item) => item.id === id);
    values.task[taskIndex].completed = !values.task[taskIndex].completed;
    const Iscomplete = values.task[taskIndex].completed;
    console.log(Iscomplete);
    const response = await fetch(
      `http://localhost:3010/projects/scrum/${projectId}/${props.bid}/${props.card._id}/task/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complete: Iscomplete,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed t update task :${response.statusText}`);
    }
    const resultData = await response.json();
    console.log("fella", resultData);
    setValues({ ...values });
  };
  const updateTitle = async (value) => {
    console.log(props.bid, props.card._id);
    const response = await fetch(
      `http://localhost:3010/projects/scrum/${projectId}/${props.bid}/${props.card._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldName: "cardName",
          newValue: value,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed t update task :${response.statusText}`);
    }
    const resultData = await response.json();
    setValues({ ...values, cardName: value });
  };

  const calculatePercent = () => {
    const totalTask = values.task.length;
    const completedTask = values.task.filter(
      (item) => item.completed === true
    ).length;

    return Math.floor((completedTask * 100) / totalTask) || 0;
  };

  const removeTag = async (id) => {
    try {
      console.log("tag id ", id);
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}/${props.bid}/${props.card._id}/tags/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.statusText}`);
      }

      // Assuming taskId is part of your state
      // Filter out the deleted task from your state
      const tempTag = values.tags.filter((item) => item.id !== id);
      setValues({
        ...values,
        tags: tempTag,
      });

      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error.message);

      // Handle errors appropriately, for example, show a notification to the user
      // You might want to use a state variable to store and display error messages
    }
  };
  const deleteCard = () => {
    //  try {
    //   const response = await fetch(
    //     `http://localhost:3010/projects/kanban/${projectId}/${targetId}/${cardId}/`,
    //     {
    //       method: "DELETE",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );

    //   // Update the state with the new data

    //   console.log("Card deleted successfully");
    // } catch (error) {
    //   console.error("Error deleting task:", error.message);
    //   // Handle errors appropriately, for example, show a notification to the user
    //   // You might want to use a state variable to store and display error messages
    // }
    if (props.onClose) props.onClose(false);
    console.log(props.bid, values._id);
    props.removeCard(props.bid, values._id);
  };
  const addTag = async (value, color) => {
    // Make the API request to update the card item
    const response = await fetch(
      `http://localhost:3010/projects/scrum/${projectId}/${props.bid}/${props.card._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldName: "tags",
          newValue: {
            tagName: value,
            color: color,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update card item: ${response.statusText}`);
    }
    const resultData = await response.json();
    const tagId = resultData.newSubDocumentId;
    values.tags.push({
      id: tagId,
      tagName: value,
      color: color,
    });

    setValues({ ...values });
  };

  const handelClickListner = (e) => {
    if (e.code === "Enter") {
      setInput(false);

      updateTitle(text === "" ? values.cardName : text);
    } else return;
  };

  useEffect(() => {
    document.addEventListener("keypress", handelClickListner);
    return () => {
      document.removeEventListener("keypress", handelClickListner);
    };
  });
  useEffect(() => {
    if (props.updateCard) props.updateCard(props.bid, values._id, values);
  }, [values]);
  useEffect(() => {
    console.log(props);
  });
  const updateFields = async (fieldName, value) => {
    values[fieldName] = value;
    const response = await fetch(
      `http://localhost:3010/projects/scrum/${projectId}/${props.bid}/${props.card._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldName: fieldName,
          newValue: value,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed t update task :${response.statusText}`);
    }
    const resultData = await response.json();
    setValues({ ...values });
  };
  const MemberButtonClick = () => {
    if (isMemberVisible === false) setIsMemberVisible(true);
    else setIsMemberVisible(false);
  };
  return (
    <SprintModal onClose={props.onClose}>
      <div className="local__bootstrap">
        <div
          className="container"
          style={{ minWidth: "650px", position: "relative" }}
        >
          <div className="row pb-4">
            <div className="col-12">
              <div className="d-flex align-items-center pt-3 gap-2">
                <CreditCard className="icon__md" />
                {input ? (
                  <Input
                    title={values.cardName}
                    onClick={() => alert("Button clicked!")}
                  />
                ) : (
                  <h5
                    style={{ cursor: "pointer" }}
                    onClick={() => setInput(true)}
                  >
                    {values.cardName}
                  </h5>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-8">
              <h6 className="text-justify">Label</h6>
              <div
                className="d-flex label__color flex-wrap"
                style={{ width: "500px", paddingRight: "10px" }}
              >
                {values.tags.length !== 0 ? (
                  values.tags.map((item) => (
                    <span
                      className="d-flex justify-content-between align-items-center gap-2"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.tagName.length > 10
                        ? item.tagName.slice(0, 6) + "..."
                        : item.tagName}
                      <X
                        onClick={() => removeTag(item.id)}
                        style={{ width: "15px", height: "15px" }}
                      />
                    </span>
                  ))
                ) : (
                  <span
                    style={{ color: "#ccc" }}
                    className="d-flex justify-content-between align-items-center gap-2"
                  >
                    <i> No Labels</i>
                  </span>
                )}
              </div>
              <div className="check__list mt-2">
                <div className="d-flex align-items-end  justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <CheckSquare className="icon__md" />
                    <h6>Check List</h6>
                  </div>
                </div>
                <div className="progress__bar mt-2 mb-2">
                  <div className="progress flex-1">
                    <div
                      class="progress-bar"
                      role="progressbar"
                      style={{ width: calculatePercent() + "%" }}
                      aria-valuenow="75"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {calculatePercent() + "%"}
                    </div>
                  </div>
                </div>

                <div className="my-2">
                  {values.task.length !== 0 ? (
                    values.task.map((item, index) => (
                      <div
                        className="task__list d-flex align-items-start gap-2"
                        key={item._id}
                      >
                        {console.log(item)} {/* Log item to console */}
                        <input
                          className="task__checkbox"
                          type="checkbox"
                          defaultChecked={item.completed}
                          onChange={() => {
                            updateTask(item.id);
                          }}
                        />
                        <EditableHeader
                          value={item}
                          id={item.id}
                          initialValue={item.taskName}
                          onSave={handleTaskClick}
                          onClose={() => {}}
                        />
                        <Trash
                          onClick={() => {
                            removeTask(item.id);
                          }}
                          style={{
                            cursor: "pointer",
                            width: "18px", // Fix typo in 'width'
                            height: "18px",
                            marginLeft: "30px",
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <></>
                  )}

                  <SprintEditable
                    parentClass={"task__editable"}
                    name={"Add Task"}
                    btnName={"Add task"}
                    onSubmit={addTask}
                  />
                </div>
              </div>
            </div>
            <div className="col-4">
              <h6>Add to card</h6>
              <div className="d-flex card__action__btn flex-column gap-2">
                <button onClick={() => setLabelShow(true)}>
                  <span className="icon__sm">
                    <Tag />
                  </span>
                  Add Label
                </button>
                {labelShow && (
                  <SprintLabel
                    color={colors}
                    addTag={addTag}
                    tags={values.tags}
                    onClose={setLabelShow}
                  />
                )}
                <ActivitySelector
                  initialPriority={values.progres}
                  setPriority={updateFields}
                />

                <StartDateButton
                  due="Start"
                  handleDate={updateFields}
                  initialDate={values.startDate}
                  value="startDate"
                />
                <StartDateButton
                  due="Due"
                  handleDate={updateFields}
                  initialDate={values.dueDate}
                  value="dueDate"
                />
                <PrioritySelector
                  initialPriority={values.priority}
                  setPriority={updateFields}
                />
                <button onClick={MemberButtonClick}>
                  <span className="icon__sm">
                    {/* Assuming User is an icon component */}
                    <User />
                  </span>
                  Members
                </button>
                {isMemberVisible && (
                  <CardMember bid={props.bid} cardId={props.card._id} />
                )}
                <button>
                  <span className="icon__sm">
                    <Paperclip />
                  </span>
                  Attachments
                </button>
                <button onClick={deleteCard}>
                  <span className="icon__sm">
                    <Trash />
                  </span>
                  Delete Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SprintModal>
  );
}
