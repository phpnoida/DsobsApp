import {Platform} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import _ from 'lodash';
import axios from 'axios';
import Helpers from './Helper';
import {PUSH_KEY} from '../../config';

const usersCollection = firestore().collection('Users');
const chatCollection = firestore().collection('Chats');
const messageCollection = firestore().collection('Messages');
const reference = database().ref('Messages');

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
 * @param {*} lastMessage
 */
export const createSingleChat = (opponentUser, lastMessage, callback) => {
  let chatId = getChatId();

  let users = [];
  let detail = {};
  detail._id = global.userDetails._id;
  detail.profileImg = global.userDetails.profileImg;
  detail.lastName = global.userDetails.lastName;
  detail.batch = global.userDetails.batch;
  detail.firstName = global.userDetails.firstName;
  detail.profession = global.userDetails.profession;
  detail.prefix = global.userDetails.prefix;
  detail.isOnline = true;
  users.push(detail);

  // Second User
  detail = {};

  detail._id = opponentUser._id;
  detail.profileImg = opponentUser.profileImg;
  detail.lastName = opponentUser.lastName;
  detail.batch = opponentUser.batch;
  detail.firstName = opponentUser.firstName;
  detail.profession = opponentUser.profession;
  detail.prefix = opponentUser.prefix;
  //detail.isOnline = opponentUser.isOnline;
  detail.isOnline = false;

  users.push(detail);

  const chatObject = {
    _id: chatId,
    users: [global.userId, opponentUser._id],
    isTyping: [
      {userId: global.userId, status: false},
      {userId: opponentUser._id, status: false},
    ],
    userInfo: users,
    lastMessage: lastMessage,
    threadId: chatId,
    isGroup: false,
    groupName: '',
    profileImg: '',
    lastMessageTime: new Date().getTime(),
    lastMessageType: 1,
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
    latestMessages: [],
  };
  chatCollection
    .doc(chatId)
    .set(chatObject)
    .then(() => {
      callback(chatObject);
    })
    .catch(() => {
      callback(false);
    });
};

export const updateChatObject = (chatId, chatObject, callback) => {
  const postReference = chatCollection.doc(chatId);
  firestore()
    .runTransaction(async transaction => {
      const postSnapshot = await transaction.get(postReference);
      if (!postSnapshot.exists) {
        throw 'Post does not exist!';
      }
      transaction.update(postReference, chatObject);
    })
    .then(() => callback(true))
    .catch(err => {
      console.log('err', err);
      callback(false);
    });

  // chatCollection
  //   .doc(chatId)
  //   .update(chatObject)
  //   .then(() => {
  //     callback(true);
  //   })
  //   .catch(() => {
  //     callback(false);
  //   });
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

    query.docs.forEach(item => {
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
 * @param {*} usersList
 * @param {*} callback
 */
export const createGroupChat = (groupName, usersList, callback) => {
  let chatId = getChatId();

  var userIds = [];
  var userTypings = [];
  var unreads = [];

  usersList.forEach(user => {
    userIds.push(user._id);
    userTypings.push({
      userId: user._id,
      status: false,
      userName: Helpers.capitalize(Helpers.concatName(user)),
    });
    unreads.push({
      userId: user._id,
      count: 0,
    });
  });

  const chatObject = {
    _id: chatId,
    users: userIds,
    isTyping: userTypings,
    userInfo: usersList,
    lastMessage: '',
    threadId: chatId,
    groupAdmin: global.userId,
    isGroup: true,
    groupName: groupName,
    profileImg: '',
    lastMessageTime: new Date().getTime(),
    lastMessageType: 1,
    createdDate: new Date().getTime(),
    unreadCount: unreads,
    mutedBy: [],
    latestMessages: [],
    removed: [],
  };

  chatCollection
    .doc(chatId)
    .set(chatObject)
    .then(() => {
      callback(chatObject);
    })
    .catch(error => {
      console.log('error', error);
      callback(null);
    });

  // const postReference = chatCollection.doc(chatId);
  // firestore()
  //   .runTransaction(async transaction => {
  //     const postSnapshot = await transaction.get(postReference);
  //     if (!postSnapshot.exists) {
  //       throw 'Post does not exist!';
  //     }
  //     transaction.update(postReference, chatObject);
  //   })
  //   .then(() => callback(true))
  //   .catch(error => {
  //     console.log('error', error);
  //     callback(false);
  //   });
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

export const getTotalMessages = async (threadId, callback) => {
  reference
    .child(threadId)
    .once('value')
    .then(snapshot => {
      console.log('User data: ', snapshot.numChildren());
      callback(snapshot.numChildren());
    })
    .catch(err => {
      console.log('err', err);
      callback(0);
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

export const checkUserExist = async (userId, isGroup) => {
  //.collection("Users").where("_id", "in", [""])
  let query = '';
  if (isGroup) {
    query = await usersCollection.where('_id', 'in', userId).get();
  } else {
    query = await usersCollection.where('_id', '==', userId).get();
  }
  if (!query.empty) {
    if (isGroup) {
      let itemArray = [];
      query.docs.forEach(item => {
        itemArray.push(item.data());
      });
      return itemArray;
    } else {
      const snapshot = query.docs[0];
      const data = snapshot.data();
      return data;
    }
  }
  return null;
};

export const addUser = async (userId, opponentUser, callback) => {
  const isExist = await checkUserExist(userId, false);

  if (isExist === null) {
    let requestObject = {
      _id: opponentUser._id,
      profileImg: opponentUser.profileImg,
      prefix: opponentUser.prefix,
      firstName: opponentUser.firstName,
      lastName: opponentUser.lastName,
      profession: opponentUser.profession,
      batch: opponentUser.batch,
      schoolNo: opponentUser.schoolNumber,
      house: opponentUser.house,
      section: opponentUser.section,
      city: opponentUser.city,
      blockedUser: [],
      blockedBy: [],
      lastseen: 0,
      chatEnabled: true,
      groups: [],
      isOnline: false,
      email: opponentUser.email,
      emailScope: opponentUser.emailScope,
      countryCode: opponentUser.countryCode,
      phone: opponentUser.phone,
      phoneScope: opponentUser.phoneScope,
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
export const setLatestUnread = (status, userId, callback) => {
  let chatObject = {
    isLatestMessages: status,
  };
  updateUserObject(chatObject, userId, callback);
};

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
    .catch(error => {
      console.log(';error', error);
      callback(false);
    });
};

/**
 *
 * @param {*} opponentId
 *
 */

export const addUserToBlockList = async (opponentId, callback) => {
  const result = await checkUserExist(global.userId, false);

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
        updateOpponentBlocking(opponentId, callback);
      })
      .catch(() => {
        callback(false);
      });
  }
};

export const updateOpponentBlocking = async (opponentId, callback) => {
  const result = await checkUserExist(opponentId, false);

  if (result !== undefined && result !== null) {
    let blockedByArray = result.blockedBy;
    const index = blockedByArray.indexOf(global.userId);
    if (index > -1) {
      blockedByArray.splice(index, 1);
    } else {
      blockedByArray.push(global.userId);
    }

    let chatObject = {
      blockedBy: blockedByArray,
    };
    usersCollection
      .doc(opponentId)
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

export const sendWelcomeMessage = (
  isGroup,
  result,
  title,
  message,
  threadId,
  callback,
) => {
  let arrayList = [];
  for (const element of result) {
    arrayList.push(
      new Promise(function (resolve, reject) {
        if (element.enableNotification) {
          console.log('====================================');
          console.log('receivers', Helpers.concatName(element));
          console.log('====================================');
          let notificationKey = element.notificationKey;
          let notificationTimestamp = element.notificationTimestamp;
          let platform = element.platform;
          let userId = element._id;
          let topic = `/topics/fcm-${userId}`;

          let data = {
            title: title,
            body: message,
            eventType: 1002,
            extra: '',
            linkUrl: '',
            icon: '',
            threadId: threadId,
            isGroup: isGroup,
          };

          createPushNotification(
            notificationKey,
            topic,
            platform,
            title,
            message,
            data,
            notificationTimestamp,
            userId,
          ).then(status => {
            resolve(status);
          });
        } else {
          resolve(false);
        }
      }),
    );
  }
  Promise.all(arrayList).then(() => {
    callback(true);
  });
};

export const sendPushNotification = async (opponentUser, message, threadId) => {
  const result = await checkUserExist(opponentUser._id, false);

  if (result !== undefined && result !== null) {
    let enableNotification = result.enableNotification;

    if (!enableNotification) {
      return false;
    }

    let notificationKey = result.notificationKey;
    let notificationTimestamp = result.notificationTimestamp;
    let platform = result.platform;
    let userId = result._id;
    let topic = `/topics/fcm-${userId}`;
    let fullname = Helpers.capitalize(Helpers.concatName(global.userDetails));

    let title = fullname;

    let data = {
      title: title,
      body: message,
      eventType: 1002,
      extra: '',
      linkUrl: '',
      icon: '',
      threadId: threadId,
      isGroup: false,
    };

    // 1-send notification on all new post 2-twice a day 3-one a day 4-every hour 5-every two hour
    return createPushNotification(
      notificationKey,
      topic,
      platform,
      title,
      message,
      data,
      notificationTimestamp,
      userId,
    );
  }
};

export const createPushNotification = async (
  notificationKey,
  topic,
  platform,
  title,
  message,
  data,
  notificationTimestamp,
  userId,
) => {
  let chatObject = {
    notificationTimestamp: new Date().getTime(),
  };
  switch (notificationKey) {
    case 1:
      return executePushNotification(topic, platform, title, message, data);
    case 2:
      if (
        notificationTimestamp !== undefined &&
        notificationTimestamp !== null &&
        notificationTimestamp !== 0
      ) {
        var duration = moment.duration(moment().diff(notificationTimestamp));
        var hours = duration.asHours();
        if (hours > 12) {
          updateUserObject(chatObject, userId, () => {
            return executePushNotification(
              topic,
              platform,
              title,
              message,
              data,
            );
          });
        }
        return false;
      } else {
        updateUserObject(chatObject, userId, () => {
          return executePushNotification(topic, platform, title, message, data);
        });
      }
      break;
    case 3:
      if (
        notificationTimestamp !== undefined &&
        notificationTimestamp !== null &&
        notificationTimestamp !== 0
      ) {
        if (!moment().isSame(notificationTimestamp, 'day')) {
          updateUserObject(chatObject, userId, () => {
            return executePushNotification(
              topic,
              platform,
              title,
              message,
              data,
            );
          });
        } else {
          return false;
        }
      } else {
        updateUserObject(chatObject, userId, () => {
          return executePushNotification(topic, platform, title, message, data);
        });
      }
      break;
    case 4:
      if (
        notificationTimestamp !== undefined &&
        notificationTimestamp !== null &&
        notificationTimestamp !== 0
      ) {
        var duration = moment.duration(moment().diff(notificationTimestamp));
        var hours = duration.asHours();
        if (hours > 1) {
          updateUserObject(chatObject, userId, () => {
            return executePushNotification(
              topic,
              platform,
              title,
              message,
              data,
            );
          });
        }
        return false;
      } else {
        updateUserObject(chatObject, userId, () => {
          return executePushNotification(topic, platform, title, message, data);
        });
      }
      break;
    case 5:
      if (
        notificationTimestamp !== undefined &&
        notificationTimestamp !== null &&
        notificationTimestamp !== 0
      ) {
        var duration = moment.duration(moment().diff(notificationTimestamp));
        var hours = duration.asHours();
        if (hours > 2) {
          updateUserObject(chatObject, userId, () => {
            return executePushNotification(
              topic,
              platform,
              title,
              message,
              data,
            );
          });
        }
        return false;
      } else {
        updateUserObject(chatObject, userId, () => {
          return executePushNotification(topic, platform, title, message, data);
        });
      }
      break;
    default:
      break;
  }
};

export const executePushNotification = async (
  to,
  platform,
  title,
  message,
  data,
) => {
  var notificationPayload = {
    to: to,
    content_available: true,
    mutable_content: true,
    data: data,
    notification: {
      body: message,
      title: title,
    },
    priority: 'high',
  };

  notificationPayload = JSON.stringify(notificationPayload);

  console.log('====================================');
  console.log('final Message: ' + notificationPayload);
  console.log('====================================');

  var config = {
    method: 'post',
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      Authorization: PUSH_KEY,
      'Content-Type': 'application/json',
    },
    data: notificationPayload,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return true;
    })
    .catch(function (error) {
      console.log(error);
      return true;
    });
};

/**
 * Push notification
 */

/**
 * Authentication
 */

export const checkUserAuthenticated = async callback => {
  auth().onAuthStateChanged(state => {
    //console.log('auth state changed', state);
    callback(state);
  });
};

export const authentication = async callback => {
  auth().onAuthStateChanged(state => {
    console.log('auth state changed', state);
    if (state === null || state === undefined) {
      if (global.isLoggedIn) {
        checkAndCreateUser(callback);
      } else {
        callback(true);
      }
    } else {
      callback(true);
    }
  });
};

export const checkAndCreateUser = async callback => {
  console.log('checkAndCreateUser');
  auth()
    .fetchSignInMethodsForEmail(global.userDetails.email)
    .then(methods => {
      if (methods.length > 0) {
        auth()
          .signInWithEmailAndPassword(
            global.userDetails.email,
            global.userDetails._id,
          )
          .then(user => {
            callback(true);
            console.log('user', user);
          })
          .catch(error => {
            console.log('====================================');
            console.log('error-833', error);
            console.log('====================================');
            callback(false);
          });
      } else {
        auth()
          .createUserWithEmailAndPassword(
            global.userDetails.email,
            global.userDetails._id,
          )
          .then(() => {
            callback(true);
          })
          .catch(() => {
            callback(false);
          });
      }
    });
};

export const clearAuthentication = async () => {
  auth()
    .signOut()
    .then(() => console.log('User signed out!'));
};

/**
 * Authentication
 */
