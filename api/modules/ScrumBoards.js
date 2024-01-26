const mongoose = require("mongoose");
const Member = require("./MemberModule");

const scrumBoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  boardType: {
    type: String,
    enum: ["backlog", "sprint"],
    required: true,
  },
  cards: [
    {
      cardName: String,
      tags: [
        {
          tagName: String,
          color: String,
        },
      ],
      task: [
        {
          taskName: String,
          complete: {
            type: Boolean,
            default: false,
          },
        },
      ],
      progres: {
        type: String,
        default: "todo",
      },
      startDate: {
        type: Date,
        default:new Date()
      },

      dueDate: Date,
      priority: String,
      continue: {
        type: Boolean,
        default: false,
      },
      storyPoints: {
        type: Number,
        default: 0,
      },
      members: [
        {
          member_id: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
          role: String,
        },
      ],
    },
  ],
  sprintStart: Date,
  sprintEnd: Date,
  goal: String,
  started: {
    type: Boolean,
    default: false,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// Use mongoose.model only once, with the schema as the second parameter
const ScrumBoard = mongoose.model("ScrumBoard", scrumBoardSchema);

module.exports = { ScrumBoard };
