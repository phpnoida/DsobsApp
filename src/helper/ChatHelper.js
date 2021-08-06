import {Platform} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';

const usersCollection = firestore().collection('Users');
const chatCollection = firestore().collection('Chats');
const messageCollection = firestore().collection('Messages');

export const getChatId = () => {
  return chatCollection.doc().id;
};
export const getThreadId = () => {
  return messageCollection.doc().id;
};

/**
 *
 * Chat operations
 *
 */

/**
 *
 * @param {*} opponentUser
 * @param {*} callback
 */
export const createSingleChat = (opponentUser, callback) => {
  let chatId = getChatId();

  let users = [];

  let detail = {};
  detail._id = global.userDetails._id;
  detail.profileImg = global.userDetails.profileImg;
  detail.lastName = global.userDetails.lastName;
  detail.batch = global.userDetails.batch;
  detail.firstName = global.userDetails.firstName;
  detail.profession = global.userDetails.profession;

  users.push(detail);

  detail = {};

  detail._id = opponentUser._id;
  detail.profileImg = opponentUser.profileImg;
  detail.lastName = opponentUser.lastName;
  detail.batch = opponentUser.batch;
  detail.firstName = opponentUser.firstName;
  detail.profession = opponentUser.profession;

  users.push(detail);

  const chatObject = {
    _id: chatId,
    users: [global.userId, opponentUser._id],
    isTyping: [
      {userId: global.userId, status: false},
      {userId: opponentUser._id, status: false},
    ],
    userInfo: users,
    lastMessage: '',
    threadId: '',
    isGroup: false,
    groupName: '',
    profileImg: '',
    lastMessageTime: new Date().getTime(),
    createdDate: new Date().getTime(),
    unreadCount: [
      {
        userId: global.userId,
        count: 0,
      },
      {
        userId: opponentUser._id,
        count: 0,
      },
    ],
    mutedBy: [],
  };
  chatCollection
    .doc(chatId)
    .set(chatObject)
    .then(() => {
      callback(chatId);
    })
    .catch(() => {
      callback(null);
    });
};

export const updateChatObject = (chatId, chatObject, callback) => {
  chatCollection
    .doc(chatId)
    .update(chatObject)
    .then(() => {
      callback(true);
    })
    .catch(() => {
      callback(false);
    });
};

export const getChatObject = async (chatId, callback) => {
  const query = await chatCollection.doc(chatId).get();

  if (query.exists) {
    return callback(query.data());
  }

  return callback(null);
};

export const getUserChat = async (opponentUser, chatType) => {
  let currentArray = [global.userId, opponentUser];

  const query = await chatCollection
    //.where('users', 'array-contains', global.userId)
    .where('users', 'array-contains-any', currentArray)
    .where('isGroup', '==', chatType === 1 ? false : true)
    .get();

  if (!query.empty) {
    let tmpArray = [];

    query.docs.forEach((item) => {
      tmpArray.push(item.data());
    });

    return tmpArray;
  }
  return null;
};

export const checkChatExist = async (opponentUser, chatType) => {
  let currentArray = [global.userId, opponentUser];

  let userChat = await getUserChat(opponentUser, chatType);

  if (userChat === null) {
    return null;
  }

  for (let i = 0; i < userChat.length; i++) {
    const item = userChat[i];
    let userList = item.users;
    if (userList.length === 2) {
      let isExist = _.isEqual(currentArray.sort(), userList.sort());
      if (isExist) {
        return item;
      }
    }
  }

  return null;
};

/**
 *
 * Message Thread operations
 *
 */

/**
 * Generate Thread
 */

export const generateMessageThread = async (users, callback) => {
  let chatId = getThreadId();
  const chatObject = {
    _id: chatId,
    users: users,
    messages: [],
  };
  messageCollection
    .doc(chatId)
    .set(chatObject)
    .then(() => {
      callback(chatId);
    })
    .catch(() => {
      callback(null);
    });
};

export const addMessageThread = async (threadId, messages, callback) => {
  const chatObject = {
    messages: messages,
  };
  messageCollection
    .doc(threadId)
    .update(chatObject)
    .then(() => {
      callback(true);
    })
    .catch(() => {
      callback(false);
    });
};

/**
 *
 * Chat operations
 *
 */

/**
 *
 * ADD user in firestore
 *
 */

export const checkUserExist = async (userId) => {
  const query = await usersCollection.where('_id', '==', userId).get();
  if (!query.empty) {
    const snapshot = query.docs[0];
    const data = snapshot.data();
    return data;
  }
  return null;
};

export const addUser = async (userId, opponentUser, callback) => {
  const isExist = await checkUserExist(userId);

  if (isExist === null) {
    let requestObject = {
      _id: opponentUser._id,
      profileImg: opponentUser.profileImg,
      prefix: opponentUser.prefix,
      firstName: opponentUser.firstName,
      lastName: opponentUser.lastName,
      profession: opponentUser.profession,
      batch: opponentUser.batch,
      blockedUser: [],
      lastseen: new Date().getTime(),
      chatEnabled: true,
      groups: [],
      isOnline: false,
      notificationKey: 1, // 1-send notification on all new post 2-twice a day 3-one a day 4-every hour 5-every two hour
      enableNotification: true,
      notificationTimestamp: 0,
      platform: Platform.OS,
    };
    usersCollection
      .doc(userId)
      .set(requestObject)
      .then(() => {
        callback(true);
      })
      .catch(() => {
        callback(false);
      });
  }
};

/**
 *
 * @param {*} isOnline
 * @param {*} lastseen
 * Set Last Seen
 */
export const setUserLastSeen = (isOnline, lastseen, callback) => {
  let chatObject = {
    lastseen: lastseen,
    isOnline: isOnline,
  };
  updateUserObject(chatObject, global.userId, callback);
};

export const updateUserObject = (object, userId, callback) => {
  usersCollection
    .doc(userId)
    .update(object)
    .then(() => {
      callback(true);
    })
    .catch(() => {
      callback(false);
    });
};

/**
 *
 * @param {*} opponentId
 *
 */

export const addUserToBlockList = async (opponentId, callback) => {
  const result = await checkUserExist(global.userId);

  if (result !== undefined && result !== null) {
    let blockedUser = result.blockedUser;

    const index = blockedUser.indexOf(opponentId);
    if (index > -1) {
      blockedUser.splice(index, 1);
    } else {
      blockedUser.push(opponentId);
    }

    let chatObject = {
      blockedUser: blockedUser,
    };
    usersCollection
      .doc(global.userId)
      .update(chatObject)
      .then(() => {
        callback(true);
      })
      .catch(() => {
        callback(false);
      });
  }
};

/**
 * Chat Message
 */
export function isSameDay(currentMessage = {}, diffMessage = {}) {
  if (!diffMessage.createdAt) {
    return false;
  }

  let currentCreatedAt = moment(currentMessage.createdAt);
  let diffCreatedAt = moment(diffMessage.createdAt);

  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
    return false;
  }

  return currentCreatedAt.isSame(diffCreatedAt, 'day');
}

export function isSameUser(currentMessage = {}, diffMessage = {}) {
  return !!(
    diffMessage.user &&
    currentMessage.user &&
    diffMessage.user._id === currentMessage.user._id
  );
}
/**
 * Chat Message
 */

/**
 * Push notification
 */
export const sendPushNotification = () => {
  var data = JSON.stringify({
    to: '/topics/fcm-602a65dca1714c5bd918612e',
    priority: 'high',
    content_available: true,
    mutable_content: true,
    data: {
      title: 'Title Text',
      body: 'Kill app from recent',
      picture:
        'https://dsobs-new.s3.ap-south-1.amazonaws.com/1614672143_993702_unnamed.png',
      eventType: 1,
      extra: '',
      linkUrl: 'https://github.com/invertase/react-native-firebase/issues/3476',
      icon: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
    },
    notification: {
      body: 'mongoose',
      title: 'mongoosee',
      image: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
    },
  });

  var config = {
    method: 'post',
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      Authorization:
        'key=AAAAa3gDRh0:APA91bHs8zrX6pvbJv7Ada8PmtOmDCA_ef0xtZKGflfjRBoMoGF-JmrfJrdtVKc2lzLIjiEMtEUYv3FjzEe3_0XiHzBcKzTyWVLzMvJFg47OtMzibvwC0ra03uzVlvxmM1qUdy3RZAOZ',
      'Content-Type': 'application/json',
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
/**
 * Push notification
 */
