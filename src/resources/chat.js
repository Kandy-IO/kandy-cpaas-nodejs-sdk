module.exports = function chat (api) {
  const baseUrl = '/cpaas/chat/v1'

  return {
    subscriptions () {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/subscriptions`)
      })
    },

    subscription ({ subscriptionId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/subscriptions/${subscriptionId}`)
      })
    },

    createSubscription ({ clientCorrelator, notifyURL }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            chatNotificationSubscription: {
              callbackReference: {
                notifyURL
              },
              clientCorrelator
            }
          }
        }
        return api.sendRequest(`${baseUrl}/${api.userId}/subscriptions`, options, 'post')
      })
    },

    deleteSubscription ({ subscriptionId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/subscriptions/${subscriptionId}`, {}, 'delete')
      })
    },

    // Extend a 1-1 chat session to a group chat session
    extendDirectChatToGroup ({ imageUrl, name, subject, type, userId, participants = [] }) {
      const options = {
        body: {
          extensionParameters: {
            participant: participants.map(participant => ({ address: participant })),
            subject,
            'x-image': imageUrl,
            'x-name': name,
            'x-type': type
          }
        }
      }

      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/oneToOne/${userId}/adhoc/extend`, options, 'post')
      })
    },

    // Different name
    sendMessage ({ userId, text }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            chatMessage: {
              text
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/oneToOne/${userId}/adhoc/messages`, options, 'post')
      })
    },

    deleteMessages ({ userId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/oneToOne/${userId}/adhoc/messages`, {}, 'put')
      })
    },

    message ({ userId, messageId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/oneToOne/${userId}/adhoc/messages/${messageId}`)
      })
    },

    deleteMessage ({ userId, messageId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/oneToOne/${userId}/adhoc/messages/${messageId}`, {}, 'delete')
      })
    },

    messageStatus ({ userId, messageId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/oneToOne/${userId}/adhoc/messages/${messageId}/status`)
      })
    },

    updateMessageStatus ({ userId, messageId, status }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            messageStatusReport: {
              status
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/oneToOne/${userId}/adhoc/messages/${messageId}/status`, options, 'put')
      })
    },

    groupSessions () {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/group`)
      })
    },

    groupSession ({ groupId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/group/${groupId}`)
      })
    },

    createGroupSession ({ admin, imageUrl, name, participants, subject, type }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            groupChatSessionInformation: {
              participant: participants.map(participant => ({ address: participant, admin: (participant === admin) })),
              subject,
              'x-image': imageUrl,
              'x-name': name,
              'x-type': type
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/group`, options, 'post')
      })
    },

    deleteGroupSession ({ groupId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/group/${groupId}`, {}, 'delete')
      })
    },

    groupSessionParticipants ({ groupId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/group/${groupId}/participants`)
      })
    },

    groupSessionParticipant ({ groupId, participantId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/group/${groupId}/participants/${participantId}`)
      })
    },

    addParticipantToGroupSession ({ groupId, participant }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            participantInformation: {
              address: participant
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/group/${groupId}/participants`, options, 'post')
      })
    },

    removeParticipantFromGroupSession ({ groupId, participantId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/group/${groupId}/participants/${participantId}`, {}, 'delete')
      })
    },

    acceptGroupSessionInvitation ({ groupId, participantId, status }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            participantSessionStatus: {
              status
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/group/${groupId}/participants/${participantId}/status`, options, 'PUT')
      })
    },

    groupSessionMessages ({ groupId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/group/${groupId}/messages`)
      })
    },

    groupSessionMessage ({ groupId, messageId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/group/${groupId}/messages/${messageId}`)
      })
    },

    sendMessageToGroupSession ({ groupId, text }) {
      const options = {
        body: {
          chatMessage: {
            text
          }
        }
      }

      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/group/${groupId}/messages`, options, 'post')
      })
    },

    deleteMessagesInGroupSession ({ groupId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/group/${groupId}/messages`, {}, 'delete')
      })
    },

    deleteMessageInGroupSession ({ groupId, messageId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/group/${groupId}/messages/${messageId}`, {}, 'delete')
      })
    },

    messageStatusInGroupSession ({ groupId, messageId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/group/${groupId}/messages/${messageId}/status`)
      })
    },

    updateMessageStatusInGroupSession ({ groupId, messageId, status }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            messageStatusReport: {
              status
            }
          }
        }

        return api.sendRequest(`${baseUrl}/${api.userId}/group/${groupId}/messages/${messageId}/status`, options, 'put')
      })
    },

    sessionsSummary () {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/sessions`)
      })
    },

    directChatSessionsSummary () {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/oneToOne/sessions`)
      })
    },

    directChatSessionsSummaryByUser ({ userId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/oneToOne/${userId}/sessions`)
      })
    },

    adhocChatSessionsSummaryByUser ({ userId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/oneToOne/${userId}/adhoc/session`)
      })
    },

    groupSessionsSummary () {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/group/sessions`)
      })
    },

    groupSessionSummary ({ groupId }) {
      return api.makeRequest(() => {
        return api.sendRequest(`${baseUrl}/${api.userId}/group/${groupId}/session`)
      })
    },

    uploadFile ({ attributes, flags }) {
      return api.makeRequest(() => {
        const options = {
          body: {
            object: {
              attributes: {
                attribute: attributes
              },
              flags: {
                flag: flags
              }
            }
          }
        }

        return api.sendRequest(`/cpaas/nms/v1/chat/${api.userId}/objects`, options, ' post')
      })
    }
  }
}
