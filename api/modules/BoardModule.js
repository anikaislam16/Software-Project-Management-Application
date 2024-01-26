const mongoose = require("mongoose");
const Member = require("./MemberModule");

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
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
      startDate: Date,
      dueDate: Date,
      priority: String,
      members: [
        {
          member_id: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
          role: String,
        },
      ],
      pdf: [{ type: mongoose.Schema.Types.ObjectId, ref: "PDF" }], // Reference to multiple PDF documents
    },
  ],
});

// Use mongoose.model only once, with the schema as the second parameter
const KanbanBoard = mongoose.model("KanbanBoard", boardSchema);

module.exports = { KanbanBoard };
