import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";

const allUsers = TryCatch(async(req,res,next)=>{
    const users = await User.find({});

    const transformedUsers = await Promise.all(
        users.map(async({_id, name, username, avatar})=>{
            const [groupChats, friendChats] = await Promise.all([
                Chat.countDocuments({groupChat: true, members: _id}),
                Chat.countDocuments({groupChat: false, members: _id}),
            ]);

            return {
                _id, 
                name,
                username,
                avatar: avatar.url,
                groupChats,
                friendChats
            }
        })
    );

    return res.status(200).json({
        success: true,
        users: transformedUsers,
    });
})


const allChats = TryCatch(async(req,res,next)=>{
    const chats = await Chat.find({})
        .populate("members", "name avatar")
        .populate("creator", "name avatar");

    const transformedChats = await Promise.all(
        chats.map(async({_id, name, groupChat, creator, members})=>{
            const totalMessages = await Message.countDocuments({chat: _id});
            return {
                _id, 
                name, 
                groupChat,
                avatar: members.slice(0, 3).map((member)=>(member.avatar.url)),
                members: members.map(({_id, name, avatar})=> ({
                    _id,
                    name,
                    avatar: avatar.url,
                })),
                creator: {
                    name: creator?.name || "none",
                    avatar: creator?.avatar.url || "",
                },
                totalMembers: members.length,
                totalMessages,
            };
        })
    );

    return res.status(200).json({
        success: true,
        chats: transformedChats,
    });
})


const allMessages = TryCatch(async(req,res,next)=>{
    const messages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chat", "groupChat");

    const transformedMessages = messages.map(({_id, content, attachments, sender, chat, createdAt})=>({
        _id, 
        content, 
        attachments, 
        createdAt,
        chat: chat._id, 
        groupChat: chat.groupChat,
        sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url,
        }, 
    }))

    return res.status(200).json({
        success: true,
        messages: transformedMessages,
    });
})


const getDashboardStats = TryCatch(async(req,res,next)=>{


    return res.status(200).json({
        success: true,
        message: "Stats",
    });
})


export {
    allUsers,
    allChats,
    allMessages,
    getDashboardStats,
}