const Conversation = module.require('../models/conversation');

exports = module.exports = (socket, type, io = null) => {
   switch (type) {
      // Use for chat
      case "join":
         socket.on("join", async (room, callback) => {
            try {
               const conv = await Conversation.findOne({_id: room}).populate({path: "members.userId"});
               callback(null, conv.messages);
               socket.join(room);
            } catch (err) {
               console.error(err);
               callback(err.message, null);
            }
         })
         break;
      case "sendMessage":
         socket.on("sendMessage", async (message, room, callback) => {
            try {
               const conversation = await Conversation.findOne({_id: room});
               conversation.messages.push(message);
               await conversation.save();

               const newMesage = conversation.messages.splice(-1)[0];

               io.to(room).emit("receiveMessage", newMesage);

               callback();
            } catch (err) {
               console.error(err);
               callback(err.message);
            }
         })
         break;
      case "disconnect":
         socket.on("disconnect", () => {
            console.log("A user disconnected");
            console.log(io.sockets.adapter.rooms);
         })
         break;
      // Use for video 
      case "joinVideo":
         socket.on("joinVideo", async ({user, friend}) => {
            try {
               const conversation = await Conversation.findOne({
                  $and: [
                     {"members.userId": user._id},
                     {"members.userId": friend._id}
                  ]
               }).select({_id: 1});

               socket.join(conversation._id.toString());
            } catch (err) {
               console.error(err);
            }
         })
         break;
      case "callToUser":
         socket.on("callToUser", async ({callId, signalData, caller}) => {
            // console.log("caller", caller);
            // console.log(callId);
            const conversation = await Conversation.findById(callId).populate({path: "members.userId"}).select({members: 1, meetings: 1});
            // console.log(conversation.members);
            const callee = conversation.members.find(member => member.userId._id.toString() !== caller._id.toString());
            io.to(callId).emit("callToUser", {signal: signalData, callId, caller, callee});
         })
         break;
      case "answerCall":
         socket.on("answerCall", ({signal, callId}) => {
            console.log("callId", callId);
            io.to(callId).emit("callAccepted", signal);
         })
         break;
   }
}
