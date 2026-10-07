import Notification from "../models/notification.model.js";


// Get all notifications belonging to the logged-in user
export const getNotifications = async (req, res, next) => {

    try {

        // req.user comes from our authentication middleware
        const userId = req.user._id;


        // Find notifications where the logged-in user
        // is the receiver
        const notifications = await Notification.find({
            receiver: userId
        })

            // Latest notification should appear first
            .sort({
                createdAt: -1
            })

            // Instead of only returning sender's ObjectId,
            // get useful sender information as well
            .populate(
                "sender",
                "name username profileImage"
            )

            // If notification belongs to a post,
            // populate basic post information
            .populate(
                "post",
                "caption image"
            )

            // If notification belongs to a reel,
            // populate basic reel information
            .populate(
                "reel"
            )

            // If notification belongs to a comment,
            // populate the comment as well
            .populate(
                "comment",
                "text"
            );


        return res.status(200).json({

            message: "Notifications fetched successfully",

            notifications
        });


    } catch (error) {

        next(error);

    }

};