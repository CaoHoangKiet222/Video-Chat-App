const {Schema, model} = require('mongoose');

const conversationSchema = new Schema({
   members: [
      {
         userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
         }
      }
   ],
   messages: [
      {
         content: {
            type: String,
            default: ''
         },
         messageDate: {
            type: Date,
            default: Date.now()
         },
         senderId: {
            type: Schema.Types.ObjectId,
            ref: "User"
         }
      }
   ],
   meetings: [
      {
         caller: {
            type: Schema.Types.ObjectId,
            ref: "User"
         },
         calleeId: {
            type: Schema.Types.ObjectId,
            ref: "User"
         },
         signal: {
            type: Schema.Types.Mixed,
            default: {}
         },
         stream: {
            type: Schema.Types.Mixed,
            default: {}
         },
         callAccepted: {
            type: Boolean,
            default: false
         },
         callEnded: {
            type: Boolean,
            default: false
         }
      }
   ]
});

module.exports = model("Conversation", conversationSchema);
