const Conversation = require("../models/conversation");
const Files = require("../models/files");
const { destroyAsset, upload } = require("../cloudinary/cloudinary");
const Reply = require("../models/reply");
const { validationResult } = require("express-validator");
const { mailer } = require("../mailer/mailer");

exports.postInvitation = (req, res, _next) => {
  try {
    console.log(req.body);

    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      return res.send({ error: errors.array()[0].msg });
    }

    mailer.sendMail(
      {
        from: process.env.NODEMAILER_AUTH_USER,
        to: req.body.email,
        subject: "Invite to Video Chat App!!!",
        html: `
              <h3>Hello ${req.body.email}</h3>
              <p>Your friend <strong>${req.body.user.name}</strong> from <strong>${req.body.user.email}</strong> send you a message.</p>
              <p><strong>${req.body.message}</strong></p>
              <p>Click <a href="${process.env.ENDPOINT_CLIENT_NETLIFY}">here</a> to join with me!!!</p>
           `,
      },
      (err, result) => {
        console.log("mailer", result);
        if (err) {
          return res.send({ error: "Something went wrong!!!" });
        }
        res.send({
          message:
            "Invitation success, waiting for him/her to join with you!!!",
        });
      }
    );
  } catch (error) {
    res.send({ error: error.message });
  }
};

exports.uploadFilesInConversation = (files) => {
  try {
    return new Promise(async (resolve) => {
      const uploadedImgsUrl = await Promise.all(
        files.images.map(({ url, fileName }) => {
          return upload({ url, fileName }, "image-preview");
        })
      );
      console.log(uploadedImgsUrl);

      const uploadedAttachmentsUrl = await Promise.all(
        files.attachments.map(({ url, fileName }) => {
          return upload({ url, fileName }, "attachments");
        })
      );
      console.log(uploadedAttachmentsUrl);

      const newFiles = await new Files({
        images: uploadedImgsUrl,
        attachments: uploadedAttachmentsUrl,
      }).save();

      resolve({ _id: newFiles._id });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteMessage = (message, conversationId) => {
  try {
    console.log("deleteMessage", message);

    Conversation.findByIdAndUpdate(
      conversationId,
      {
        $pull: {
          messages: { _id: message._id },
        },
      },
      async (error, conversation) => {
        console.log(conversation);
        if (error) {
          return new Error(error.message);
        }

        // delete when it points to other message
        Reply.findOneAndDelete(
          {
            _id: conversation.messages[0].reply,
          },
          (error, reply) => {
            console.log("delete reply", reply);
            if (error) {
              return new Error(error.message);
            }
          }
        );

        // delete when it is message root
        Reply.deleteMany(
          { meesage_id: conversation.messages[0]._id },
          (_error, reply) => {
            console.log("deleteMany reply", reply);
          }
        );

        Files.findByIdAndDelete(conversation.messages[0].files, (err, file) => {
          console.log(file);
          if (err) {
            return new Error(error.message);
          }

          if (!file) {
            return new Error("Delete in cloudinary fail!!!");
          }

          file.images.forEach(({ public_id }) => {
            destroyAsset(public_id, "image");
          });

          file.attachments.forEach(({ public_id }) => {
            destroyAsset(public_id, "raw");
          });
        });
      }
    )
      .select({ messages: { $elemMatch: { _id: message._id } } })
      .populate("messages.files");
  } catch (error) {
    res.send({ error: error.message });
  }
};
