function(commands) {
  switch (command.actions) {
    case 'message_channel_all':
      return message_channel_all(command);
      break;
    case 'message_channel_members':
      return message_channel_members(command);
      break;
    case 'message_friends':
      return message_friends(command);
      break;
    case 'get_channels':
      return get_channels(command);
  }
}
